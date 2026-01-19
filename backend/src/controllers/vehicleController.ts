import { Request, Response } from 'express';
import * as vehicleService from '../services/vehicleService';
import { uploadMultipleToCloudinary, deleteMultipleFromCloudinary } from '../config/cloudinary';
import { AuthRequest } from '../middleware/auth';

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const filters = {
      ...req.query,
      page: parseInt((req.query.page as string) || '1'),
      limit: parseInt((req.query.limit as string) || '20'),
      priceMin: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
      priceMax: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
      minYear: req.query.minYear ? parseInt(req.query.minYear as string) : undefined,
      maxYear: req.query.maxYear ? parseInt(req.query.maxYear as string) : undefined,
      sortBy: ((req.query.sortBy as string) || 'default') as 'default' | 'price-low' | 'price-high' | 'year-new' | 'year-old' | 'brand',
    };
    const vehicles = await vehicleService.getVehicles(filters);
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.json(vehicle);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const getVehicleBySlug = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.getVehicleBySlug(req.params.slug);
    res.json(vehicle);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const getSimilarVehicles = async (req: Request, res: Response) => {
  try {
    const { id, limit } = req.query;
    const vehicles = await vehicleService.getSimilarVehicles(id as string, parseInt(limit as string) || 4);
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId || 'admin-user-id';

    const vehicleData = { ...req.body };

    // Convert string values to proper types from FormData
    if (typeof vehicleData.year === 'string') {
      vehicleData.year = parseInt(vehicleData.year);
    }
    if (typeof vehicleData.priceKES === 'string') {
      vehicleData.priceKES = parseInt(vehicleData.priceKES);
    }
    if (typeof vehicleData.mileage === 'string') {
      vehicleData.mileage = parseInt(vehicleData.mileage);
    }
    if (typeof vehicleData.featured === 'string') {
      vehicleData.featured = vehicleData.featured === 'true';
    }
    if (typeof vehicleData.isDraft === 'string') {
      vehicleData.isDraft = vehicleData.isDraft === 'true';
    }

    const files = (req as any).files as Express.Multer.File[];

    console.log('Files received:', files?.length || 0);

    if (files && files.length > 0) {
      try {
        const uploadedImages = await uploadMultipleToCloudinary(files);
        vehicleData.images = uploadedImages.map(img => img.url);
        vehicleData.imageUrl = uploadedImages[0].url;
        vehicleData.imagePublicIds = uploadedImages.map(img => img.publicId);
        console.log('Successfully uploaded images to Cloudinary:', uploadedImages.length);
      } catch (uploadError: any) {
        console.error('Cloudinary upload failed:', uploadError);
        if (uploadError.message?.includes('cloud_name')) {
          return res.status(500).json({
            success: false,
            error: {
              message: 'Cloudinary configuration error: Please check CLOUDINARY_CLOUD_NAME in .env file',
              code: 'CLOUDINARY_CONFIG_ERROR',
              suggestion: 'Set valid Cloudinary credentials or contact administrator',
            },
          });
        }
        if (uploadError.message?.includes('api_key')) {
          return res.status(500).json({
            success: false,
            error: {
              message: 'Cloudinary configuration error: Please check CLOUDINARY_API_KEY in .env file',
              code: 'CLOUDINARY_CONFIG_ERROR',
              suggestion: 'Set valid Cloudinary credentials or contact administrator',
            },
          });
        }
        const defaultImageUrl = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        vehicleData.imageUrl = defaultImageUrl;
        vehicleData.images = [defaultImageUrl];
        console.log('Using default image due to Cloudinary error');
      }
    } else {
      const defaultImageUrl = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      vehicleData.imageUrl = defaultImageUrl;
      vehicleData.images = [defaultImageUrl];
      vehicleData.imagePublicIds = [];
      console.log('No images uploaded, using default image:', defaultImageUrl);
    }

    console.log('Creating vehicle with data:', {
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      images: vehicleData.images?.length || 0,
    });

    const vehicle = await vehicleService.createVehicle(vehicleData, userId);
    res.status(201).json({
      success: true,
      vehicle,
      message: 'Vehicle created successfully',
    });
  } catch (error: any) {
    console.error('Create vehicle error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).json({
      success: false,
      error: {
        message: error.message,
        code: 'CREATE_VEHICLE_ERROR',
        details: error.details || null,
      },
    });
  }
};

export const getAdminVehicles = async (req: Request, res: Response) => {
  try {
    const filters = {
      ...req.query,
      page: parseInt((req.query.page as string) || '1'),
      limit: parseInt((req.query.limit as string) || '1000'),
      priceMin: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
      priceMax: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
      minYear: req.query.minYear ? parseInt(req.query.minYear as string) : undefined,
      maxYear: req.query.maxYear ? parseInt(req.query.maxYear as string) : undefined,
      sortBy: ((req.query.sortBy as string) || 'default') as 'default' | 'price-low' | 'price-high' | 'year-new' | 'year-old' | 'brand',
      includeDrafts: true,
    };
    const result = await vehicleService.getVehicles(filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId || 'admin-user-id';

    const vehicleData = { ...req.body };

    // Convert string values to proper types from FormData
    if (typeof vehicleData.year === 'string') {
      vehicleData.year = parseInt(vehicleData.year);
    }
    if (typeof vehicleData.priceKES === 'string') {
      vehicleData.priceKES = parseInt(vehicleData.priceKES);
    }
    if (typeof vehicleData.mileage === 'string') {
      vehicleData.mileage = parseInt(vehicleData.mileage);
    }
    if (typeof vehicleData.featured === 'string') {
      vehicleData.featured = vehicleData.featured === 'true';
    }
    if (typeof vehicleData.isDraft === 'string') {
      vehicleData.isDraft = vehicleData.isDraft === 'true';
    }

    const files = (req as any).files as Express.Multer.File[];
    if (files && files.length > 0) {
      const existingVehicle = await vehicleService.getVehicleById(req.params.id);
      if (existingVehicle.imagePublicIds && existingVehicle.imagePublicIds.length > 0) {
        await deleteMultipleFromCloudinary(existingVehicle.imagePublicIds);
      }

      const uploadedImages = await uploadMultipleToCloudinary(files);
      vehicleData.images = uploadedImages.map(img => img.url);
      vehicleData.imageUrl = uploadedImages[0].url;
      vehicleData.imagePublicIds = uploadedImages.map(img => img.publicId);
    } else if (!vehicleData.imageUrl && !vehicleData.images) {
      const existingVehicle = await vehicleService.getVehicleById(req.params.id);
      vehicleData.imageUrl = existingVehicle.imageUrl;
      vehicleData.images = existingVehicle.images || [existingVehicle.imageUrl];
      vehicleData.imagePublicIds = existingVehicle.imagePublicIds || [];
    } else if (vehicleData.images && vehicleData.images.length > 0) {
      vehicleData.imageUrl = vehicleData.images[0];
    }

    const vehicle = await vehicleService.updateVehicle(req.params.id, vehicleData, userId);
    res.json({
      success: true,
      vehicle,
      message: 'Vehicle updated successfully',
    });
  } catch (error: any) {
    console.error('Update vehicle error:', error);
    res.status(400).json({
      success: false,
      error: {
        message: error.message,
        code: 'UPDATE_VEHICLE_ERROR',
        details: error.details || null,
      },
    });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (vehicle.imagePublicIds && vehicle.imagePublicIds.length > 0) {
      await deleteMultipleFromCloudinary(vehicle.imagePublicIds);
    }
    const result = await vehicleService.deleteVehicle(req.params.id, authReq.user?.userId || 'system');
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const getFeaturedVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getFeaturedVehicles();
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehicleSuggestions = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    if (!search || typeof search !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const vehicles = await vehicleService.getVehicleSuggestions(search);
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleFeatured = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const userId = authReq.user?.id || 'admin-user-id';

    const vehicle = await vehicleService.lifecycle.toggleFeatured(req.params.id, userId);
    res.json(vehicle);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const userId = authReq.user?.id || 'admin-user-id';

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const vehicle = await vehicleService.lifecycle.updateStatus(req.params.id, status, userId);
    res.json(vehicle);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
