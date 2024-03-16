import Image from "next/image";
import { useState } from "react";

const ViewImage = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  images = images?.map((image) => {
    if (image.fields.file.url.startsWith("//")) {
      image.fields.file.url = image.fields.file.url.replace("//", "https://");
    }
    return image;
  });
  return (
    <div className="relative flex h-full w-full flex-col-reverse items-center gap-5 md:flex-row md:items-start">
      <div className="flex w-full gap-2.5 overflow-x-auto rounded-lg bg-slate-100 p-2 sm:h-[350px] sm:w-auto sm:overflow-y-auto sm:overflow-x-hidden md:flex-col">
        {images &&
          images.map((image, index) => {
            let imageUrl = image.fields.file.url;
            if (imageUrl.startsWith("//")) {
              imageUrl = imageUrl.replace("//", "https://");
            }
            return (
              <div
                key={index}
                onClick={() => setCurrentImage(index)}
                className="block h-16 w-16 origin-bottom cursor-pointer rounded-md border duration-150 hover:bg-slate-500 hover:shadow-sm active:ring-2"
              >
                <Image
                  src={imageUrl}
                  alt="image"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover object-top hover:opacity-80"
                />
              </div>
            );
          })}
      </div>
      <div className="h-full max-h-[575px] w-full rounded-xl border shadow-md">
        {images && (
          <Image
            src={images[currentImage].fields.file.url}
            alt="image"
            width={500}
            height={500}
            className="h-full w-full rounded-xl object-cover object-top"
          />
        )}
      </div>
    </div>
  );
};

export default ViewImage;
