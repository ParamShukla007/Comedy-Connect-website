import React from "react";

const ImageGallery = ({ images }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
    {images.map((image, index) => (
      <img
        key={index}
        src={image}
        alt={`Gallery image ${index + 1}`}
        className="rounded-lg object-cover w-full h-48"
      />
    ))}
  </div>
);

export default ImageGallery;
