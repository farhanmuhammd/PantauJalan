
import cloudinary from "../config/cloudinary.js";

export const uploadImage = (file, folder) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `pantaujalan/${folder}`,
                resource_type: "image",
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Upload gambar gagal"));

                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            },
        );

        stream.end(file.buffer);
    });

export const deleteImages = async (images = []) => {
    await Promise.all(
        images.map(async (image) => {
            if (!image?.public_id) return;

            const result = await cloudinary.uploader.destroy(image.public_id);

            if (result.result !== "ok" && result.result !== "not found") {
                throw new Error(
                    `Gagal menghapus gambar Cloudinary: ${image.public_id}`,
                );
            }
        }),
    );
};
