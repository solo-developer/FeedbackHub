using System.Security.Cryptography;
using System.Text;

namespace FeedbackHub.Domain.Helpers
{
    public class AESEncryptionHelper
    {
        public AESEncryptionHelper()
        {
            
        }
        private readonly string _key;
        private readonly string _iv;

        // Constructor to receive key and IV from Configuration
        public AESEncryptionHelper(string key, string iv)
        {
            _key = key;
            _iv = iv;
        }

        // Encrypt plaintext
        public string Encrypt(string plainText)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(_key);  // 16 bytes key (128-bit key)
                aesAlg.IV = Encoding.UTF8.GetBytes(_iv);    // 16 bytes IV (128-bit IV)

                using (ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter sw = new StreamWriter(cs))
                            {
                                sw.Write(plainText);
                            }
                        }

                        // Return the encrypted data as a Base64-encoded string
                        return Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
        }

        // Decrypt ciphertext
        public string Decrypt(string cipherText)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(_key);  // 16 bytes key (128-bit key)
                aesAlg.IV = Encoding.UTF8.GetBytes(_iv);    // 16 bytes IV (128-bit IV)

                using (ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV))
                {
                    using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(cipherText)))
                    {
                        using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader sr = new StreamReader(cs))
                            {
                                return sr.ReadToEnd();
                            }
                        }
                    }
                }
            }
        }
    }
}
