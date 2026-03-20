import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const IMAGE_TRANSFORMS = {
  grid: 'w_400,h_300,c_fill,q_auto,f_auto',
  og: 'w_1200,h_630,c_fill,q_auto,f_auto',
  gallery: 'w_1200,q_auto,f_auto',
  blur: 'w_50,e_blur:1000,q_10',
  share: 'w_1200,h_630,c_fill,e_enhance,e_auto_color',
  dataSaver: 'w_300,q_30,f_auto',
};

export function getTransformedUrl(publicId: string, transform: keyof typeof IMAGE_TRANSFORMS): string {
  const baseTransform = IMAGE_TRANSFORMS[transform];
  return cloudinary.url(publicId, {
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      ...(transform === 'share' ? [{ effect: 'enhance' }, { effect: 'auto_color' }] : []),
    ],
    secure: true,
  });
}

export function getGridUrl(url: string): string {
  if (!url) return '/placeholder-car.jpg';
  return url.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto,f_auto/');
}

export function getOgUrl(url: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80';
  return url.replace('/upload/', '/upload/w_1200,h_630,c_fill,q_auto,f_auto/');
}

export function getGalleryUrl(url: string): string {
  if (!url) return '/placeholder-car.jpg';
  return url.replace('/upload/', '/upload/w_1200,q_auto,f_auto/');
}

export function getBlurPlaceholder(url: string): string {
  if (!url) return '/placeholder-car.jpg';
  return url.replace('/upload/', '/upload/w_50,e_blur:1000,q_10/');
}

export function getShareCardUrl(url: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80';
  return url.replace('/upload/', '/upload/w_1200,h_630,c_fill,e_enhance,e_auto_color/');
}

export function getDataSaverUrl(url: string): string {
  if (!url) return '/placeholder-car.jpg';
  return url.replace('/upload/', '/upload/w_300,q_30,f_auto/');
}

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = 'vehicles'
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
          { quality: 'auto:best', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result?.secure_url || '',
            publicId: result?.public_id || '',
          });
        }
      }
    ).end(file.buffer);
  });
};

export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  folder: string = 'vehicles'
): Promise<Array<{ url: string; publicId: string }>> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
  return Promise.all(uploadPromises);
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export const deleteMultipleFromCloudinary = async (publicIds: string[]): Promise<void> => {
  const deletePromises = publicIds.map(id => deleteFromCloudinary(id));
  await Promise.all(deletePromises);
};

export default cloudinary;
