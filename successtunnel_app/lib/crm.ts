export async function pushLeadToCRM(leadData: any) {
  const crmUrl = process.env.CRM_API_URL
  const crmKey = process.env.CRM_API_KEY

  if (!crmUrl) {
    console.log('[CRM Integration] CRM_API_URL is not set. Simulating successful CRM lead push for:', leadData.email)
    return { success: true, simulated: true }
  }

  try {
    const response = await fetch(crmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(crmKey && { 'Authorization': `Bearer ${crmKey}` })
      },
      body: JSON.stringify(leadData)
    })

    if (!response.ok) {
      console.error('[CRM Integration] Failed to push lead. Status:', response.status)
      return { success: false, error: 'CRM API Error' }
    }

    console.log('[CRM Integration] Successfully pushed lead to CRM:', leadData.email)
    return { success: true }
  } catch (error) {
    console.error('[CRM Integration] Exception while pushing lead:', error)
    return { success: false, error }
  }
}
