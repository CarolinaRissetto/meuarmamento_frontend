export const copyUrl = (successCallback?: () => void) => {
    const url = window.location.href;

    navigator.clipboard.writeText(url).then(() => {
        successCallback && successCallback()
    }).catch(err => {
        console.error("Erro ao copiar ID: ", err);
    });
};