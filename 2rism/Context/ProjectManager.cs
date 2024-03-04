using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace _2rism.Context
{
    public class ProjectManager
    {
        public static string GetHash(string input)
        {
            var md5 = MD5.Create();
            var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(input));

            return Convert.ToBase64String(hash);
        }

        public async static void SendEmail(string email, string subject, string body)
        {
            MailAddress from = new MailAddress("tworism@mail.ru", "2rism");
            MailAddress to = new MailAddress(email);

            string htmlBody = $@"
            <html>
                <body style='font-family: Arial, sans-serif; background-color: #f0f0f0; margin: 0; padding: 0;'>
                    <div style='background-color: #ffffff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>
                        <h2 style='color: #333333; text-align: center;'>Авторизация</h2>
                        <p style='color: #555555; font-size: 16px; text-align: center;'>Для авторизации на сайте 2rism, введите следующий код подтверждения:</p>
                        <h3 style='background-color: #f5f5f5; padding: 10px; border-radius: 5px; color: #333333; text-align: center;'>{body}</h3>
                        <p style='color: #555555; font-size: 16px; text-align: center;'>Хорошего времяпровождения!</p>
                        <p style='color: #555555; font-size: 16px; text-align: center;'>Команда 2rism - 2024</p>
                    </div>
                </body>
            </html>";

            MailMessage message = new MailMessage(from, to)
            {
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };

            SmtpClient smtp = new SmtpClient("smtp.mail.ru", 587);
            smtp.Credentials = new NetworkCredential("tworism@mail.ru", "pjznSnRsST6rwzhMUXHG");
            smtp.EnableSsl = true;

            await smtp.SendMailAsync(message);
        }

        public static int code = 0;
        public static int GenerateRecoveryCode()
        {
            Random rnd = new Random();
            code = rnd.Next(100000, 999999);
            return code;
        }
    }
}
