import VehicleFormPage from '../new/page';

export default function EditVehiclePage({
  params,
}: {
  params: { id: string };
}) {
  return <VehicleFormPage params={params} />;
}
