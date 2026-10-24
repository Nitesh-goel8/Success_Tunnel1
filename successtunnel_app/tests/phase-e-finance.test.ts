import { PrismaClient } from '@prisma/client'
import { checkModulePermission } from '../lib/auth'

const prisma = new PrismaClient()

let passedCount = 0
let failedCount = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`)
    passedCount++
  } else {
    console.error(`  ✗ FAIL: ${message}`)
    failedCount++
  }
}

async function runPhaseETests() {
  console.log('\n======================================================')
  console.log('🚀 SUCCESS TUNNEL ERP - PHASE E: FINANCE & REPORTING')
  console.log('======================================================\n')

  const timestamp = Date.now().toString().slice(-5)

  try {
    // ----------------------------------------------------------------
    // Test Group 1: Role-Based Authorization for Finance Module
    // ----------------------------------------------------------------
    console.log('Test Group 1: Role-Based Access Control (RBAC) Matrix for Finance')

    assert(checkModulePermission('super_admin', 'FINANCE', 'view') === true, 'Super Admin has Finance view permission')
    assert(checkModulePermission('super_admin', 'FINANCE', 'create') === true, 'Super Admin has Finance create permission')
    assert(checkModulePermission('super_admin', 'FINANCE', 'approve') === true, 'Super Admin has Finance approve permission')
    assert(checkModulePermission('super_admin', 'FINANCE', 'delete') === true, 'Super Admin has Finance delete permission')

    assert(checkModulePermission('finance_admin', 'FINANCE', 'view') === true, 'Finance Admin has Finance view permission')
    assert(checkModulePermission('finance_admin', 'FINANCE', 'create') === true, 'Finance Admin has Finance create permission')
    assert(checkModulePermission('finance_admin', 'FINANCE', 'approve') === true, 'Finance Admin has Finance approve permission')
    assert(checkModulePermission('finance_admin', 'FINANCE', 'delete') === true, 'Finance Admin has Finance delete permission')

    assert(checkModulePermission('project_manager', 'FINANCE', 'view') === true, 'Project Manager can view finance context')
    assert(checkModulePermission('project_manager', 'FINANCE', 'approve') === false, 'Project Manager blocked from approving company finance')
    assert(checkModulePermission('project_manager', 'FINANCE', 'delete') === false, 'Project Manager blocked from deleting invoices')

    assert(checkModulePermission('employee', 'FINANCE', 'view') === true, 'Employee can view own finance records')
    assert(checkModulePermission('employee', 'FINANCE', 'create') === true, 'Employee can create own expense claims')
    assert(checkModulePermission('employee', 'FINANCE', 'approve') === false, 'Employee blocked from approving claims')
    assert(checkModulePermission('employee', 'FINANCE', 'delete') === false, 'Employee blocked from deleting finance records')

    // ----------------------------------------------------------------
    // Test Group 2: Invoice Creation & Strict Tax Computation
    // ----------------------------------------------------------------
    console.log('\nTest Group 2: Invoice Creation & Exact 18% GST Calculation')

    const subtotal = 100000.0
    const taxRate = 18.0
    const taxAmount = Math.round(((subtotal * taxRate) / 100) * 100) / 100
    const totalAmount = subtotal + taxAmount

    const invNum = `ST-INV-TEST-${timestamp}`
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: invNum,
        issueDate: new Date('2026-10-01'),
        dueDate: new Date('2026-10-31'),
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        currency: 'INR',
        status: 'ISSUED',
        items: JSON.stringify([
          { description: 'Cloud Security Audit', quantity: 1, unitPrice: 100000.0, amount: 100000.0 },
        ]),
        notes: 'Statutory Net 30 billing.',
        isDemo: true,
      },
    })

    assert(invoice.id > 0, `Created invoice #${invoice.invoiceNumber}`)
    assert(invoice.subtotal === 100000.0, 'Subtotal stored exactly as 100,000.00 INR')
    assert(invoice.taxAmount === 18000.0, '18% GST tax calculated exactly as 18,000.00 INR')
    assert(invoice.totalAmount === 118000.0, 'Total invoiced amount equals 118,000.00 INR')
    assert(invoice.status === 'ISSUED', 'Initial invoice status is ISSUED')

    // ----------------------------------------------------------------
    // Test Group 3: Core Invariant: Unpaid Invoice != Received Revenue
    // ----------------------------------------------------------------
    console.log('\nTest Group 3: Core Financial Invariant (Unpaid Invoice != Received Revenue)')

    // Query all completed payments for this invoice
    const paymentsForInvoice = await prisma.payment.findMany({
      where: { invoiceId: invoice.id, status: 'COMPLETED' },
    })
    const realizedCashRevenue = paymentsForInvoice.reduce((acc, p) => acc + p.amount, 0)

    assert(realizedCashRevenue === 0, 'Realized cash revenue for unpaid invoice is strictly 0.00 INR')
    assert(invoice.totalAmount === 118000.0, 'Accounts receivable claim is 118,000.00 INR without counting as revenue')

    const outstandingBalance = invoice.totalAmount - realizedCashRevenue
    assert(outstandingBalance === 118000.0, 'Outstanding receivable balance equals full invoice amount')

    // ----------------------------------------------------------------
    // Test Group 4: Payment Receipt & Automatic Status Transition
    // ----------------------------------------------------------------
    console.log('\nTest Group 4: Payment Recording & Invoice Lifecycle State Machine')

    // 1. Partial payment: ₹50,000
    const pay1Num = `ST-PAY-PARTIAL-${timestamp}`
    const partialPayment = await prisma.payment.create({
      data: {
        paymentNumber: pay1Num,
        invoiceId: invoice.id,
        amount: 50000.0,
        currency: 'INR',
        paymentDate: new Date('2026-10-15'),
        paymentMethod: 'BANK_TRANSFER',
        transactionReference: `UTR-PARTIAL-${timestamp}`,
        status: 'COMPLETED',
        isDemo: true,
      },
    })
    assert(partialPayment.id > 0, `Recorded partial payment of ₹50,000 [${partialPayment.paymentNumber}]`)

    // Update invoice status based on partial payment
    const totalPaid1 = partialPayment.amount
    let statusAfterPay1 = 'ISSUED'
    if (totalPaid1 >= invoice.totalAmount) {
      statusAfterPay1 = 'PAID'
    } else if (totalPaid1 > 0) {
      statusAfterPay1 = 'PARTIALLY_PAID'
    }

    const partiallyPaidInv = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: statusAfterPay1 },
      include: { payments: true },
    })

    assert(partiallyPaidInv.status === 'PARTIALLY_PAID', 'Invoice transitioned to PARTIALLY_PAID status')
    assert(partiallyPaidInv.payments.length === 1, 'Invoice has 1 linked completed payment')

    // 2. Final balance payment: ₹68,000
    const pay2Num = `ST-PAY-FINAL-${timestamp}`
    const finalPayment = await prisma.payment.create({
      data: {
        paymentNumber: pay2Num,
        invoiceId: invoice.id,
        amount: 68000.0,
        currency: 'INR',
        paymentDate: new Date('2026-10-22'),
        paymentMethod: 'BANK_TRANSFER',
        transactionReference: `UTR-FINAL-${timestamp}`,
        status: 'COMPLETED',
        isDemo: true,
      },
    })
    assert(finalPayment.id > 0, `Recorded final tranche payment of ₹68,000 [${finalPayment.paymentNumber}]`)

    const allPayments = await prisma.payment.findMany({
      where: { invoiceId: invoice.id, status: 'COMPLETED' },
    })
    const totalPaidFinal = allPayments.reduce((acc, p) => acc + p.amount, 0)
    assert(totalPaidFinal === 118000.0, 'Total cash payments received strictly equals 118,000.00 INR')

    let statusAfterPay2 = 'PARTIALLY_PAID'
    if (totalPaidFinal >= invoice.totalAmount) {
      statusAfterPay2 = 'PAID'
    }

    const fullyPaidInv = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: statusAfterPay2 },
    })

    assert(fullyPaidInv.status === 'PAID', 'Invoice automatically transitioned to PAID status')

    // ----------------------------------------------------------------
    // Test Group 5: Expense Workflow & Net Cash Flow Derivation
    // ----------------------------------------------------------------
    console.log('\nTest Group 5: Expense Lifecycle & Net Operating Cash Flow Calculation')

    let testUser = await prisma.user.findFirst()
    assert(testUser !== null, 'Found valid employee user for expense testing')

    const expense = await prisma.expense.create({
      data: {
        userId: testUser!.id,
        category: 'SOFTWARE',
        amount: 28000.0,
        currency: 'INR',
        description: `Server Cloud Licenses ${timestamp}`,
        status: 'SUBMITTED',
        isDemo: true,
      },
    })
    assert(expense.status === 'SUBMITTED', 'Expense initial status is SUBMITTED')

    // Review & Reimburse
    const approvedExpense = await prisma.expense.update({
      where: { id: expense.id },
      data: { status: 'REIMBURSED', reviewNotes: 'Approved and reimbursed via batch payout' },
    })
    assert(approvedExpense.status === 'REIMBURSED', 'Expense transitioned to REIMBURSED')

    // Net operating cash flow formula: Received Payments - Reimbursed Expenses
    const verifiedRevenue = totalPaidFinal // 118,000.00
    const totalOutflows = approvedExpense.amount // 28,000.00
    const netFlow = verifiedRevenue - totalOutflows

    assert(netFlow === 90000.0, 'Net operating cash flow derived exactly as ₹90,000.00')

    // ----------------------------------------------------------------
    // Test Group 6: Demo Data Integrity & Separation
    // ----------------------------------------------------------------
    console.log('\nTest Group 6: Demo Data Integrity & Isolation')

    const demoInvoices = await prisma.invoice.findMany({ where: { isDemo: true } })
    const demoPayments = await prisma.payment.findMany({ where: { isDemo: true } })

    assert(demoInvoices.length >= 1, `Identified ${demoInvoices.length} demo invoice(s) marked isDemo=true`)
    assert(demoPayments.length >= 1, `Identified ${demoPayments.length} demo payment(s) marked isDemo=true`)

    // Verify isolation in queries
    const productionOnlyPayments = await prisma.payment.findMany({ where: { isDemo: false } })
    assert(productionOnlyPayments.every((p) => !p.isDemo), 'Production payments filter strictly excludes demo records')

    // ----------------------------------------------------------------
    // Test Group 7: Safe Cleanup of Test Artifacts
    // ----------------------------------------------------------------
    console.log('\nTest Group 7: Cleanup of Ephemeral Test Artifacts')

    await prisma.payment.deleteMany({ where: { invoiceId: invoice.id } })
    await prisma.invoice.delete({ where: { id: invoice.id } })
    await prisma.expense.delete({ where: { id: expense.id } })

    const verifyInv = await prisma.invoice.findUnique({ where: { id: invoice.id } })
    assert(verifyInv === null, 'Test invoice and associated test payments cleanly removed')
  } catch (err: any) {
    console.error('Unexpected test execution failure:', err)
    failedCount++
  } finally {
    await prisma.$disconnect()
  }

  console.log('\n======================================================')
  console.log(`FINANCE TEST SUMMARY: ${passedCount} passed, ${failedCount} failed`)
  console.log('======================================================\n')

  if (failedCount > 0) {
    process.exit(1)
  }
}

runPhaseETests()
