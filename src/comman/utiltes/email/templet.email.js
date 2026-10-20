import { APP_NAME } from "../../../../config/config.service.js"


export const transactionEmailTemplate = ({ to, amount, sender, transactionId }={}) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Payment Received</title>
</head>
<body style="margin:0; padding:0; background:#eef3f1; font-family:Arial, Helvetica, sans-serif; color:#1f2d2d;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f1; padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:12px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#1d4d4f; padding:24px; color:#ffffff; font-size:22px; font-weight:bold;">
              Vaultly Wallet
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 24px;">
              <h2 style="margin:0 0 10px; font-size:22px;">You received money</h2>
              <p style="margin:0 0 20px; color:#5b6b6b; line-height:1.5;">Hi ${to}, ${sender} sent money to your wallet.</p>

              <p style="margin:0 0 20px; padding:20px; background:#f2f7f5; border-radius:8px; text-align:center; font-size:32px; font-weight:bold; color:#1f9d55;">
                + EGP ${amount}
              </p>

              <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px; border-top:1px solid #e3ebe8;">
                <tr><td style="color:#5b6b6b;">From</td><td align="right"><b>${sender}</b></td></tr>
                <tr><td style="color:#5b6b6b;">Date</td><td align="right"><b>${new Date().toLocaleDateString()}</b></td></tr>
                <tr><td style="color:#5b6b6b;">Transaction ID</td><td align="right"><b>${transactionId}</b></td></tr>
              </table>
              <p style="margin:28px 0 0; text-align:center;">
                <a href="#" style="display:inline-block; background:#1d4d4f; color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:8px; font-weight:bold;">View Transaction</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f2f7f5; padding:18px 24px; text-align:center; font-size:12px; color:#7a8a8a; line-height:1.5;">
              Need help? Reply to this email.<br>
              © 2026 Vaultly · Cairo, Egypt
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}


export const sendEmailTemplate = ({ title, email , message})=>{
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>
<body style="margin:0; padding:0; background:#eef3f1; font-family:Arial, Helvetica, sans-serif; color:#1f2d2d;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f1; padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:12px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#1d4d4f; padding:24px; color:#ffffff; font-size:22px; font-weight:bold;">
              Vaultly Wallet
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 24px;">
              <h2 style="margin:0 0 10px; font-size:22px;">You received money</h2>
              <p style="margin:0 0 20px; color:#5b6b6b; line-height:1.5;">Hi ${email}, ${APP_NAME} sent otp to for verification.</p>

              <p style="margin:0 0 20px; padding:20px; background:#f2f7f5; border-radius:8px; text-align:center; font-size:32px; font-weight:bold; color:#1f9d55;">
                ${message}
              </p>
              <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px; border-top:1px solid #e3ebe8;">
                <tr><td style="color:#5b6b6b;">From</td><td align="right"><b> ${APP_NAME}</b></td></tr>
                <tr><td style="color:#5b6b6b;">Date</td><td align="right"><b>${new Date().toLocaleDateString()}</b></td></tr>
              </table>

              <p style="margin:28px 0 0; text-align:center;">
                <a href="#" style="display:inline-block; background:#1d4d4f; color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:8px; font-weight:bold;">View Transaction</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f2f7f5; padding:18px 24px; text-align:center; font-size:12px; color:#7a8a8a; line-height:1.5;">
              Need help? Reply to this email.<br>
              © 2026 Vaultly · Cairo, Egypt
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}



