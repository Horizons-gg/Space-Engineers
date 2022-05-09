function UploadMedia() {
    let Formdata = new FormData()
    Formdata.append('file', $('#media-upload').prop('files')[0])

    fetch('/upload', {
        method: 'POST',
        body: Formdata,
        redirect: 'follow'
    })
        .then(res => res.text())
        .then(text => alert(text))
}