const ZipUploader = ({zipUploadHandler}) => {
    const uploadHandler = (event) => {
        const input = event.target;
        const zipFile = input.files[0];
        zipUploadHandler(zipFile);
        input.value = null;
    }

    return (
        <input 
            type='file'
            accept='.zip'
            onChange={uploadHandler}/>
    );
};

export default ZipUploader;