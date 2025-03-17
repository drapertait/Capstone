document.getElementById("decryptMessageButton").addEventListener("click", async function() {
    const encryptedMessage = document.getElementById("messageToDecrypt").value;
    const privateKeyString = localStorage.getItem("privateKey");

    if (!privateKeyString) {
        console.error("Private Key not found. Please generate keys first.");
        return;
    }

    try {
        console.log("Attempting to decrypt the message...");

        const privateKey = await importPrivateKey(privateKeyString);
        const encryptedBuffer = base64ToArrayBuffer(encryptedMessage);

        console.log("Decryption key imported and encrypted buffer prepared");

        const decryptedData = await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            encryptedBuffer
        );

        const decoder = new TextDecoder();
        const decryptedMessage = decoder.decode(decryptedData);
        console.log("Decryption successful");

        document.getElementById("decryptedMessage").textContent = decryptedMessage;
    } catch (error) {
        console.error("Decryption failed:", error.message);
    }
});

// Function to import a private key (PKCS8 format)
async function importPrivateKey(privateKeyString) {
    const privateKeyBuffer = base64ToArrayBuffer(privateKeyString);

    return await window.crypto.subtle.importKey(
        "pkcs8",  // Ensure using 'pkcs8' for private key
        privateKeyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["decrypt"]
    );
}

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
