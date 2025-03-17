document.getElementById("generateKeysButton").addEventListener("click", async function() {
    const keys = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );

    publicKey = keys.publicKey;
    privateKey = keys.privateKey;

    // Save keys to local storage
    localStorage.setItem("publicKey", await exportKey(publicKey));
    localStorage.setItem("privateKey", await exportPrivateKey(privateKey));

    alert("RSA Keys Generated and Saved in Local Storage");

    const privateKeyStr = await exportPrivateKey(privateKey);
    document.getElementById("currentPrivateKey").textContent = privateKeyStr;
});

// Export public key to Base64
async function exportKey(key) {
    const exported = await window.crypto.subtle.exportKey("spki", key);
    return arrayBufferToBase64(exported);
}

// Export private key to Base64 (PKCS8 format)
async function exportPrivateKey(key) {
    const exported = await window.crypto.subtle.exportKey("pkcs8", key);
    return arrayBufferToBase64(exported);
}

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
