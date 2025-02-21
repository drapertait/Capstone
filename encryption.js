document.getElementById("encryptMessageButton").addEventListener("click", async function() {
    const message = document.getElementById("messageToEncrypt").value;
    const publicKeyString = localStorage.getItem("publicKey");
    
    if (!publicKeyString) {
        alert("Public Key not found. Please generate keys first.");
        return;
    }

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(message);

    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        base64ToArrayBuffer(publicKeyString),
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["encrypt"]
    );

    const encryptedData = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        dataBuffer
    );

    const encryptedMessage = arrayBufferToBase64(encryptedData);
    document.getElementById("encryptedMessage").textContent = encryptedMessage;
});

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
