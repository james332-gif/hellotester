
export default async function handler(req, res) {
    res.setHeader(
        "Access-Control-Allow-Origin",
        process.env.ALLOWED_ORIGIN
    )
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") {
        return res.status(200).end()
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        const { username, passwordProvided, timestamp } = req.body

        if (!username || typeof username !== "string") {
            return res.status(400).json({ error: "Missing username" })
        }

        const response = await fetch(
            "https://api.resend.com/emails",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: process.env.FROM_EMAIL,
                    to: [process.env.NOTIFY_TO],
                    subject: "Login test notification",
                    text: `
Login test submitted.

Username: ${username}
Password entered: ${passwordProvided ? "Yes" : "No"}
Time: ${timestamp}

No password was collected.
                    `
                })
            }
        )

        if (!response.ok) {
            return res.status(500).json({
                error: "Resend email failed"
            })
        }

        return res.status(200).json({ success: true })

    } catch (error) {
        return res.status(500).json({ error: "Server error" })
    }
}

