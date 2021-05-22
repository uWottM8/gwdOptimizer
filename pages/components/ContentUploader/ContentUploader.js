const ContentUploader = ({fileUploadHandler}) => {
    const fileInputChangeHandler = (event) => {
        const input = event.target;
        const value = input.files[0];
        fileUploadHandler(value);
        input.value = null;
    }

    return (
        <input 
            type="file" 
            name="file" 
            accept=".html"
            onChange={fileInputChangeHandler}/>
    );
}

export default ContentUploader;