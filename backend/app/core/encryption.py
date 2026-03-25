from cryptography.fernet import Fernet
import os

# Simulate At-Rest Encryption
# In production, keys should come from AWS KMS / HashiCorp Vault.
# Here we generate a key if it doesn't exist, and store it in environment.

ENCRYPTION_KEY_FILE = "/tmp/docuagent_encryption_key.key"


def _get_or_create_key() -> bytes:
    if os.path.exists(ENCRYPTION_KEY_FILE):
        with open(ENCRYPTION_KEY_FILE, "rb") as key_file:
            return key_file.read()
    else:
        key = Fernet.generate_key()
        with open(ENCRYPTION_KEY_FILE, "wb") as key_file:
            key_file.write(key)
        return key


KEY = _get_or_create_key()
fernet = Fernet(KEY)


def encrypt_data(data: str) -> str:
    """Encrypt sensitive data before storing at rest."""
    encoded_data = data.encode()
    encrypted_data = fernet.encrypt(encoded_data)
    return encrypted_data.decode()


def decrypt_data(encrypted_data: str) -> str:
    """Decrypt sensitive data read from storage."""
    decrypted_data = fernet.decrypt(encrypted_data.encode())
    return decrypted_data.decode()
