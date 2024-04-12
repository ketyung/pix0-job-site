import React, {  useState, ReactNode, useRef } from 'react';

type dProps = {

    children? : string|ReactNode, 

    multiple? : boolean,

    title? : string, 

    onDrop?: (base64data : string) => void, 

    acceptedTypes? : string[],

    acceptedExtensions? : string[],
}

function DndUploader ({children, multiple, title, onDrop, acceptedTypes, acceptedExtensions}: dProps) {


  const [files, setFiles] = useState<{data: string, name : string }[]>([]);



  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const fileList = Array.from( e.dataTransfer.files);
      if ( multiple){
          handleImageBase64Data(fileList);
      }else {

          if ( fileList.length === 1 ){
              handleImageBase64Data([fileList[0]], true );
          }
      }
  };


  const handleImageBase64Data = (fileList: FileList | File[], setImageOnDrop? : boolean) =>{

      let aTypes = acceptedTypes ?? ['image/jpeg', 'image/png', 'image/gif'];

      Array.from(fileList).forEach(file => {
            if (aTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64Data = reader.result as string;

                    //console.log("imageData: ", base64Data);

                    const dataURL = `data:image/jpeg;base64,${btoa(base64Data)}`;
                    //console.log("dataURL: ", dataURL);

                    setFiles(prevFiles => [...prevFiles, { name: file.name, data: dataURL }]);
                    if (onDrop && setImageOnDrop) onDrop(base64Data);
                };
                reader.readAsDataURL(file);
            }
      });
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
  };

  const handleFileInputChange =(e: React.ChangeEvent<HTMLInputElement>) => {
   
    const fileList = e.target.files;

    if ( fileList !== null) {

      if ( multiple){
          handleImageBase64Data(fileList);
      }else {
          if ( fileList.length === 1 ){
              handleImageBase64Data([fileList[0]], true );
          }
      }
    }
   
  };

  const defaultUploadComp = <>
    <h2>Drag and Drop Files Here</h2>
      {files.length > 0 && (
        <ul className='text-xs'>
          {files.map((file, index) => (
            <li key={`fUpl_${index}`}>{file.name}</li>
          ))}
        </ul>
    )}
  </>

  return <div  onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={ children ?  'cursor-pointer' : 'cursor-pointer border border-gray-300 rounded p-2 lg:w-3/5 w-full lg:mx-auto' }
      title={title ?? 'Drag & Drop File Here'}
    >
    { children ?? defaultUploadComp}
    <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
          multiple={multiple}
          accept={(acceptedExtensions ?? [".jpg", ".jpeg", ".png",".gif"]).join(", ")}
      />
    </div>;
};

export default DndUploader;
