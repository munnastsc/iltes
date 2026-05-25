export async function sendWhatsApp(message: string) {
    const url = process.env.GREEN_API_URL;
    const instance = process.env.GREEN_API_INSTANCE;
    const token = process.env.GREEN_API_TOKEN;
    const phone = process.env.ADMIN_WHATSAPP;

    if (!url || !instance || !token || !phone) return;

    try {
        await fetch(`${url}/waInstance${instance}/sendMessage/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chatId: `${phone}@c.us`,
                message,
            }),
        });
    } catch {
        // notification failure should not break the main flow
    }
}
