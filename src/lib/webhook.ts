import { getContactWebhookParams } from './userSettings'

const WEBHOOK_URL =
  'https://pricehubble.app.n8n.cloud/webhook/c1abf944-35e0-4a2d-96b5-1ddb35d346b0'

export const WebhookAction = {
  CLAIM_OFFER_REDUCE_PAYMENT: 'claim_offer_reduce_payment',
  CLAIM_OFFER_REDUCE_TERM: 'claim_offer_reduce_term',
  CONTACT_BROKER_EQUITY: 'contact_broker_equity',
  CONTACT_ME_SELLING: 'contact_me_selling',
  BOOK_EPC_ASSESSMENT: 'book_epc_assessment',
  FIND_OUT_MORE_ALERT: 'find_out_more_alert',
} as const

export type WebhookActionId =
  (typeof WebhookAction)[keyof typeof WebhookAction]

export async function triggerWebhook(
  action: string,
  extra?: Record<string, string>,
): Promise<void> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        ...getContactWebhookParams(),
        ...extra,
        triggeredAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      console.error('Webhook request failed', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Webhook request failed', error)
  }
}

