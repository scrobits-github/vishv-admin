import { notification } from "antd";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

export const uploadImage = async (file, path) => {
  const ImgRef = ref(storage, `${path}/${file.name}`);
  const uploadImg = await uploadBytesResumable(ImgRef, file);
  const imageUrl = await getDownloadURL(uploadImg.ref);
  notification.success({ message: "Image uploaded successfully" });
  return imageUrl;
};

export const deleteImage = async (link) => {
  var pictureItem = link;
  var url_token = pictureItem.split("?");
  var url = url_token[0].split("/");
  var filePath = url[url.length - 1].replaceAll("%2F", "/");
  const desertRef = ref(storage, filePath);

  // Delete the file
  // const res = await deleteObject(desertRef);

  deleteObject(desertRef)
    .then((res) => {
      console.log("Image deleted sucessfully");
    })
    .catch((err) => {
      console.log("Error", err);
    });

  // console.log(res);

  return;
};
