'use client';

import { Vehicle } from '@/lib/types';
import { formatPrice, formatStatus, getSeatsCount } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export default function VehicleModal({
  isOpen,
  onClose,
  vehicle,
}: VehicleModalProps) {
  if (!vehicle) return null;

  const seats = getSeatsCount(vehicle.bodyType, vehicle.model);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${vehicle.make} ${vehicle.model} ${vehicle.year}`} size="lg">
      <div className="row">
        <div className="col-md-6">
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="img-fluid rounded"
            style={{ borderRadius: '12px' }}
          />
        </div>
        <div className="col-md-6">
          <h3 className="text-primary mb-3">{formatPrice(vehicle.priceKES)}</h3>
          <p className="mb-4">{vehicle.description}</p>
          <div className="table-responsive">
            <table className="table table-sm">
              <tbody>
                <tr>
                  <td className="fw-bold">Year</td>
                  <td>{vehicle.year}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Make</td>
                  <td>{vehicle.make}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Model</td>
                  <td>{vehicle.model}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Body Type</td>
                  <td>{formatStatus(vehicle.bodyType)}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Engine</td>
                  <td>{vehicle.engine}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Transmission</td>
                  <td>{vehicle.transmission}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Drivetrain</td>
                  <td>{vehicle.drivetrain}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Fuel Type</td>
                  <td>{formatStatus(vehicle.fuelType)}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Exterior Color</td>
                  <td>{vehicle.exteriorColor}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Interior Color</td>
                  <td>{vehicle.interiorColor}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Seats</td>
                  <td>{seats}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Mileage</td>
                  <td>{vehicle.mileage.toLocaleString()} km</td>
                </tr>
                <tr>
                  <td className="fw-bold">VIN</td>
                  <td>{vehicle.vin}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Status</td>
                  <td>{formatStatus(vehicle.status)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-4 d-flex gap-3">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <a href="tel:+254722000000" className="btn btn-primary">
          <i className="fas fa-phone me-2"></i>Call Now
        </a>
        <a
          href="https://wa.me/254722000000"
          className="btn text-white"
          style={{ backgroundColor: '#25D366' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp me-2"></i>WhatsApp
        </a>
      </div>
    </Modal>
  );
}
