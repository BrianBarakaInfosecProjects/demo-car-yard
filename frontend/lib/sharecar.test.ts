import { buildShareCaption, buildShareUrl } from './sharecar'

const mockCar = {
  make: 'Toyota', model: 'Prado', year: 2020,
  price: 8500000, imageUrl: 'https://example.com/img.jpg',
  slug: 'toyota-prado-2020', mileage: 45000, fuelType: 'Diesel'
}

test('caption includes make, model, year', () => {
  const c = buildShareCaption(mockCar)
  expect(c).toContain('Toyota')
  expect(c).toContain('Prado')
  expect(c).toContain('2020')
})

test('caption includes formatted price', () => {
  const c = buildShareCaption(mockCar)
  expect(c).toContain('8,500,000')
})

test('caption includes mileage when provided', () => {
  const c = buildShareCaption(mockCar)
  expect(c).toContain('45,000')
})

test('caption works without optional fields', () => {
  const minimal = { ...mockCar, mileage: undefined, fuelType: undefined }
  const c = buildShareCaption(minimal)
  expect(c).toContain('Toyota')
  expect(c).not.toContain('undefined')
})

test('share url contains slug', () => {
  const url = buildShareUrl('toyota-prado-2020')
  expect(url).toContain('toyota-prado-2020')
  expect(url).not.toContain('undefined')
})
