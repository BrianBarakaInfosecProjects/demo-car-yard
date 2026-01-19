'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Upload, X, Image as ImageIcon, AlertCircle, Car, Check } from 'lucide-react';

interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  priceKES: number;
  mileage: number;
  bodyType: 'SEDAN' | 'SUV' | 'TRUCK' | 'COUPE' | 'HATCHBACK' | 'WAGON';
  fuelType: 'GASOLINE' | 'DIESEL' | 'HYBRID' | 'ELECTRIC';
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  engine: string;
  vin: string;
  location: string;
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED' | 'NEW' | 'USED' | 'CERTIFIED_PRE_OWNED' | 'ON_SALE';
  featured: boolean;
  description: string;
  isDraft: boolean;
  scheduledAt: string;
}

interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Rich preset data
const PRESETS = {
  makes: [
    'Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Audi', 'Ford',
    'Chevrolet', 'Nissan', 'Kia', 'Hyundai', 'Mazda', 'Volkswagen',
    'Lexus', 'Porsche', 'Tesla', 'Jeep', 'Ram', 'GMC', 'Subaru',
    'Genesis', 'Volvo', 'Jaguar', 'Land Rover', 'Acura', 'Infiniti',
    'Buick', 'Cadillac', 'Chrysler', 'Dodge', 'Fiat', 'Lincoln',
    'Mitsubishi', 'Peugeot', 'Renault', 'Suzuki', 'Smart',
  ],
  models: {
    Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Hilux', 'Land Cruiser', 'Prado', 'Vitz', 'Avalon'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Odyssey', 'Ridgeline', 'Fit', 'Insight', 'City'],
    BMW: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', 'X1', 'X3', 'X5', 'X7', 'X6', 'Z4', 'M3', 'M5'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'A-Class', 'B-Class', 'GLC', 'GLE', 'GLS', 'GLA', 'GLB'],
    Audi: ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'RS5', 'RS6'],
    Ford: ['F-150', 'Mustang', 'Fusion', 'Escape', 'Explorer', 'Expedition', 'Ranger', 'Focus', 'Taurus', 'Edge'],
    Chevrolet: ['Silverado', 'Malibu', 'Cruze', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Camaro', 'Corvette'],
    Nissan: ['Altima', 'Sentra', 'Maxima', 'Leaf', 'Rogue', 'Pathfinder', 'Armada', 'Murano', 'Frontier', 'Titan'],
    Kia: ['Optima', 'Sorento', 'Sportage', 'Telluride', 'Seltos', 'Rio', 'Forte', 'Soul', 'Stinger'],
    Hyundai: ['Elantra', 'Sonata', 'Santa Fe', 'Tucson', 'Palisade', 'Kona', 'Venue', 'Veloster', 'Ioniq'],
    Mazda: ['CX-5', 'CX-9', 'CX-30', 'Mazda3', 'Mazda6', 'MX-5', 'Miata', 'CX-90'],
    Volkswagen: ['Golf', 'Jetta', 'Passat', 'Tiguan', 'Atlas', 'Touareg', 'ID.4', 'Taos', 'Arteon'],
    Lexus: ['ES', 'GS', 'LS', 'NX', 'RX', 'GX', 'LX', 'UX', 'IS'],
    Porsche: ['911', 'Cayenne', 'Panamera', 'Macan', 'Taycan', 'Boxster', 'Cayman'],
    Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster'],
  },
  bodyTypes: [
    { value: 'SEDAN', label: 'Sedan', description: 'Traditional 4-door car' },
    { value: 'SUV', label: 'SUV', description: 'Sport Utility Vehicle' },
    { value: 'TRUCK', label: 'Truck', description: 'Pickup truck' },
    { value: 'COUPE', label: 'Coupe', description: '2-door sporty car' },
    { value: 'HATCHBACK', label: 'Hatchback', description: 'Compact with hatch' },
    { value: 'WAGON', label: 'Wagon', description: 'Station wagon' },
  ],
  fuelTypes: [
    { value: 'GASOLINE', label: 'Petrol', description: 'Standard gasoline' },
    { value: 'DIESEL', label: 'Diesel', description: 'Diesel fuel' },
    { value: 'HYBRID', label: 'Hybrid', description: 'Petrol + Electric' },
    { value: 'ELECTRIC', label: 'Electric', description: 'Full electric' },
  ],
  transmissions: [
    'Automatic', 'Manual', 'CVT', 'Dual-Clutch', 'DSG', 'Tiptronic',
  ],
  drivetrains: [
    { value: 'FWD', label: 'FWD', description: 'Front-Wheel Drive' },
    { value: 'RWD', label: 'RWD', description: 'Rear-Wheel Drive' },
    { value: 'AWD', label: 'AWD', description: 'All-Wheel Drive' },
    { value: '4WD', label: '4WD', description: 'Four-Wheel Drive' },
  ],
  colors: [
    'Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Brown', 'Beige',
    'Gold', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Navy',
    'Burgundy', 'Metallic Gray', 'Metallic Blue', 'Metallic Silver',
    'Pearl White', 'Midnight Blue', 'Forest Green', 'Sunset Orange',
    'Ruby Red', 'Champagne', 'Bronze', 'Copper', 'Charcoal',
    'Ivory', 'Cream', 'Tan', 'Olive', 'Teal', 'Maroon',
  ],
  locations: [
    'Nairobi Showroom', 'Mombasa Road', 'Westlands', 'Industrial Area', 'Karen',
    'Eastleigh', 'Thika Road', 'Ngong Road', 'Waiyaki Way', 'Mombasa Showroom',
    'Kisumu', 'Mombasa', 'Nakuru', 'Eldoret', 'Kisii',
  ],
  statuses: [
    { value: 'AVAILABLE', label: 'Available', color: 'bg-green-100 text-green-700' },
    { value: 'NEW', label: 'New', color: 'bg-blue-100 text-blue-700' },
    { value: 'USED', label: 'Used', color: 'bg-gray-100 text-gray-700' },
    { value: 'CERTIFIED_PRE_OWNED', label: 'Certified Pre-Owned', color: 'bg-orange-100 text-orange-700' },
    { value: 'ON_SALE', label: 'On Sale', color: 'bg-purple-100 text-purple-700' },
    { value: 'RESERVED', label: 'Reserved', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'SOLD', label: 'Sold', color: 'bg-red-100 text-red-700' },
  ],
  enginePresets: [
    '1.0L', '1.2L', '1.5L', '1.6L', '1.8L', '2.0L', '2.5L', '3.0L', '3.5L', '4.0L', '5.0L',
    'V6 2.7L', 'V6 3.0L', 'V6 3.5L', 'V6 4.0L', 'V8 5.0L',
  ],
};

export default function VehicleFormPage({ params }: { params: { id?: string } }) {
  const router = useRouter();
  const vehicleId = params?.id;
  const [isEditing, setIsEditing] = useState(!!vehicleId);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<ApiError | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);
  const [formData, setFormData] = useState<VehicleFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    priceKES: 0,
    mileage: 0,
    bodyType: 'SEDAN',
    fuelType: 'GASOLINE',
    transmission: 'Automatic',
    drivetrain: 'FWD',
    exteriorColor: '',
    interiorColor: '',
    engine: '',
    vin: '',
    location: '',
    status: 'AVAILABLE',
    featured: false,
    description: '',
    isDraft: false,
    scheduledAt: '',
  });

  useEffect(() => {
    console.log('=== Vehicle Form Component Mounted ===');
    console.log('vehicleId:', vehicleId);
    console.log('isEditing:', isEditing);
    if (vehicleId) {
      setIsEditing(true);
      fetchVehicle(vehicleId);
    }

    return () => {
      console.log('=== Vehicle Form Component Unmounted ===');
    };
  }, []);

  const generateDescription = () => {
    if (formData.make && formData.model) {
      return `Well-maintained ${formData.year} ${formData.make} ${formData.model}. ${formData.bodyType} in ${formData.transmission.toLowerCase()} transmission with ${formData.drivetrain}. Fuel type: ${PRESETS.fuelTypes.find(f => f.value === formData.fuelType)?.label}.`;
    }
    return '';
  };

  const fetchVehicle = async (id: string) => {
    try {
      const data = await api.get(`/vehicles/${id}`);
      setFormData(data);
      if (data.images && data.images.length > 0) {
        const apiURL = typeof window !== 'undefined'
          ? `${window.location.protocol}//${window.location.hostname}:5000`
          : 'http://localhost:5000';
        setImagePreviews(data.images.map((img: string) => `${apiURL}${img}`));
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      setSubmitError({ message: 'Failed to load vehicle data' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmittingRef.current) {
      console.warn('=== Form Submit Blocked - Already Submitting (ref) ===');
      return;
    }

    const nativeEvent = e.nativeEvent as unknown as { submitter?: HTMLElement };
    const submitter = nativeEvent.submitter;
    console.log('=== Form Submit Attempted ===');
    console.log('Submit button clicked:', submitter);
    console.log('Submit button type:', (submitter as any)?.type);
    console.log('Submit button text:', submitter?.textContent);
    console.log('Form data:', formData);
    console.log('Image files:', imageFiles.length);
    console.log('Loading state:', loading);
    console.log('Submit status:', submitStatus);

    if (loading || submitStatus === 'submitting') {
      console.warn('=== Form Submit Blocked - Already Submitting ===');
      return;
    }

    if (submitter && (submitter as any)?.type !== 'submit') {
      console.warn('=== Form Submit Blocked - Not a Submit Button ===');
      return;
    }

    isSubmittingRef.current = true;

    setSubmitStatus('submitting');
    setSubmitError(null);
    setLoading(true);

    try {
      if (!formData.make || !formData.model || !formData.year) {
        throw new Error('Please select Make, Model, and Year');
      }

      if (!formData.priceKES || formData.priceKES <= 0) {
        throw new Error('Please enter a valid price');
      }

      if (!formData.mileage || formData.mileage < 0) {
        throw new Error('Please enter valid mileage');
      }

      if (!formData.description || formData.description.length < 10) {
        throw new Error('Description must be at least 10 characters. Click "Auto-fill Description" button to generate one automatically.');
      }

      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof VehicleFormData];
        if (value !== undefined && value !== null) {
          if (typeof value === 'boolean') {
            formDataToSend.append(key, value ? 'true' : 'false');
          } else if (typeof value === 'number') {
            formDataToSend.append(key, String(value));
          } else if (typeof value === 'string') {
            formDataToSend.append(key, value);
          }
        }
      });

      console.log('Adding images to FormData:', imageFiles.length);
      imageFiles.forEach((file) => {
        console.log('Adding file:', file.name, file.size);
        formDataToSend.append('images', file);
      });

      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const fullURL = `${apiURL}/vehicles${isEditing ? `/${vehicleId}` : ''}`;
      
      console.log('=== API Request ===');
      console.log('URL:', fullURL);
      console.log('Method:', isEditing ? 'PUT' : 'POST');
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      console.log('Token present:', !!token);
      console.log('Token length:', token?.length || 0);

      let response;
      try {
        response = await fetch(fullURL, {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      } catch (fetchError: any) {
        console.error('=== Fetch Failed ===');
        console.error('Fetch error:', fetchError);
        console.error('Error name:', fetchError.name);
        console.error('Error message:', fetchError.message);
        throw new Error(`Network error: Unable to connect to server at ${apiURL}. Please ensure the backend is running.`);
      }

      console.log('Response received');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        const text = await response.text();
        console.error('Response text:', text);
        throw new Error(`Server returned invalid response (status ${response.status})`);
      }

      if (!response.ok) {
        const errorMessage = responseData.error?.message || responseData.message || (isEditing ? 'Failed to update vehicle' : 'Failed to create vehicle');
        const errorDetails = responseData.error?.details || responseData.error?.suggestion;
        const fullMessage = errorDetails ? `${errorMessage}\n\n${errorDetails}` : errorMessage;
        console.error('=== API Error ===');
        console.error('Status:', response.status);
        console.error('Message:', errorMessage);
        console.error('Full response:', responseData);
        throw new Error(fullMessage);
      }

      console.log('=== Vehicle Saved Successfully ===');
      setSubmitStatus('success');
      setLoading(false);
      isSubmittingRef.current = false;
      alert(isEditing ? 'Vehicle updated successfully!' : 'Vehicle created successfully!');

      setTimeout(() => {
        router.push('/admin/vehicles');
      }, 500);
    } catch (error: any) {
      console.error('=== Submission Error ===');
      console.error('Error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      setSubmitStatus('error');
      setSubmitError({
        message: error.message || 'Failed to save vehicle',
        code: error.code,
        details: error.details,
      });
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      addFiles(files);
    }
    e.target.value = '';
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const rejectedFiles: string[] = [];

    newFiles.forEach((file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const validSize = file.size <= 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        rejectedFiles.push(`${file.name} (invalid type)`);
      } else if (!validSize) {
        rejectedFiles.push(`${file.name} (too large, max 5MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (rejectedFiles.length > 0) {
      alert(`The following files were rejected:\n${rejectedFiles.join('\n')}\n\nOnly JPEG, PNG, GIF, WebP files up to 5MB are allowed.`);
    }

    if (imageFiles.length + validFiles.length > 8) {
      const canAdd = 8 - imageFiles.length;
      alert(`Maximum 8 images allowed. You can add ${canAdd} more image${canAdd !== 1 ? 's' : ''}.`);
      setImageFiles([...imageFiles, ...validFiles.slice(0, canAdd)]);

      validFiles.slice(0, canAdd).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      return;
    }

    setImageFiles([...imageFiles, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      addFiles(files);
    }
  };

  const clearAllImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
    console.log('Input changed:', field, '=', value);
    setFormData((prev) => {
      const newState = { ...prev, [field]: value };
      return newState;
    });
    
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setSubmitError(null);
    }
  };

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h1>
          <p className="text-base text-gray-600">
            {isEditing ? 'Update vehicle information' : 'Select a vehicle or enter details manually'}
          </p>
        </div>
        <Link
          href="/admin/vehicles"
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          <span>Cancel</span>
        </Link>
      </div>

      {/* Error Display */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">Error Saving Vehicle</h3>
            <p className="text-sm text-red-700 mt-1">{submitError.message}</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate autoComplete="off" className="p-6 space-y-8">

          {/* Quick Select Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Quick Vehicle Selection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Make */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Make</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                >
                  <option value="">Select Make</option>
                  {PRESETS.makes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  disabled={!formData.make}
                >
                  <option value="">
                    {formData.make ? `Select ${formData.make} Model` : 'Select Make First'}
                  </option>
                  {formData.make && PRESETS.models[formData.make as keyof typeof PRESETS.models]?.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                >
                  {Array.from({ length: new Date().getFullYear() - 1989 + 1 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                  ))}
                </select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Body Type</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  value={formData.bodyType}
                  onChange={(e) => handleInputChange('bodyType', e.target.value)}
                >
                  {PRESETS.bodyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                >
                  {PRESETS.fuelTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Essential Fields (User must type) */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <Car size={20} />
              Essential Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (KSh) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-sm">KSh</span>
                  <input
                    type="number"
                    className="w-full pl-12 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    value={formData.priceKES}
                    onChange={(e) => handleInputChange('priceKES', parseInt(e.target.value))}
                    min="0"
                    required
                    placeholder="Enter price..."
                  />
                </div>
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mileage (km) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                  min="0"
                  placeholder="Enter mileage..."
                  required
                />
              </div>

              {/* VIN */}
              <div className="md:col-span-2 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">VIN (Optional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base uppercase"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  placeholder="e.g., JH4KA3150K000000"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Specs (Rich Dropdowns) */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Vehicle Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Transmission */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                >
                  {PRESETS.transmissions.map(trans => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
              </div>

              {/* Drivetrain */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Drivetrain</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  value={formData.drivetrain}
                  onChange={(e) => handleInputChange('drivetrain', e.target.value)}
                >
                  {PRESETS.drivetrains.map(drive => (
                    <option key={drive.value} value={drive.value} title={drive.description}>
                      {drive.label} - {drive.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Engine */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Engine</label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    value={formData.engine}
                    onChange={(e) => handleInputChange('engine', e.target.value)}
                  >
                    <option value="">Select Engine</option>
                    {PRESETS.enginePresets.map(engine => (
                      <option key={engine} value={engine}>{engine}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder="Or enter custom engine"
                    value={formData.engine}
                    onChange={(e) => handleInputChange('engine', e.target.value)}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                >
                  <option value="">Select Location</option>
                  {PRESETS.locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Colors with Autocomplete */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Colors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Exterior Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exterior Color</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    list="exterior-colors"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    value={formData.exteriorColor}
                    onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
                    placeholder="Select or type color..."
                  />
                  <datalist id="exterior-colors">
                    {PRESETS.colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Interior Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Interior Color</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    list="interior-colors"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    value={formData.interiorColor}
                    onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                    placeholder="Select or type color..."
                  />
                  <datalist id="interior-colors">
                    {PRESETS.colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Publishing */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Status & Publishing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.statuses.map(status => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => handleInputChange('status', status.value)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                        formData.status === status.value
                          ? status.color
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Vehicle</span>
                </label>
              </div>

              {/* Draft */}
              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.isDraft}
                    onChange={(e) => handleInputChange('isDraft', e.target.checked)}
                  />
                  <span className="text-sm font-medium text-gray-700">Save as Draft</span>
                </label>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule Publish</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  value={formData.scheduledAt}
                  onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                  disabled={formData.isDraft}
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to publish immediately</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description
              </label>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleInputChange('description', generateDescription());
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Auto-fill Description
              </button>
            </div>
            <textarea
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter vehicle description or click 'Auto-fill Description'..."
            />
            <p className="text-xs text-gray-500 mt-1">Click 'Auto-fill Description' to generate based on vehicle selections.</p>
          </div>

          {/* Image Upload */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Vehicle Images
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload up to 8 images. Images are stored in Cloudinary CDN.
              Leave empty to use a default stock image.
            </p>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {imagePreviews.length > 0 ? (
                <div className="w-full">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeImage(index);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const hiddenInput = document.createElement('input');
                        hiddenInput.type = 'file';
                        hiddenInput.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
                        hiddenInput.multiple = true;
                        hiddenInput.onchange = (ev) => {
                          const event = ev as Event;
                          event.preventDefault();
                          event.stopPropagation();
                          const files = (ev.target as HTMLInputElement).files;
                          if (files) {
                            addFiles(Array.from(files));
                          }
                        };
                        hiddenInput.click();
                      }}
                    >
                      <Upload size={18} />
                      <span>Add More</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        clearAllImages();
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 cursor-pointer font-medium"
                    >
                      <X size={18} />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-blue-50 rounded-full">
                      <ImageIcon className="text-blue-600" size={48} />
                    </div>
                  </div>
                  <h6 className="text-lg font-semibold text-gray-900 mb-2">
                    Drag & Drop images here
                  </h6>
                  <p className="text-sm text-gray-600 mb-4">or click to browse files</p>
                  <div
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload size={18} />
                    <span>Select Images</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    multiple
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleImageChange(e);
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <span>Accepted formats:</span>
                <span className="font-medium">JPEG, PNG, GIF, WebP (Max 5MB per file)</span>
              </div>
              <span className="font-medium">{imagePreviews.length}/8 images</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/admin/vehicles"
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <X size={18} />
              <span>Cancel</span>
            </Link>
            <button
              type="submit"
              disabled={loading || submitStatus === 'submitting'}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              {submitStatus === 'submitting' ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <div className="w-5 h-5 text-green-400">
                    <Check size={20} />
                  </div>
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>{isEditing ? 'Update Vehicle' : 'Add Vehicle'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
