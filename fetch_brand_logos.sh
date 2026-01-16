#!/bin/bash

# Car Brand Logo Fetcher Script
# This script fetches car brand logos and saves them to a specified directory

# Configuration - Output to the brands folder where Next.js serves static files
OUTPUT_DIR="/workspaces/demo-car-yard/frontend/public/brands"
TEMP_FILE="logo_urls.txt"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Array of car brands with normalized keys
declare -A BRAND_MAPPING
BRAND_MAPPING=(
    ["Toyota"]="toyota"
    ["Nissan"]="nissan"
    ["Subaru"]="subaru"
    ["Mazda"]="mazda"
    ["Honda"]="honda"
    ["Mitsubishi"]="mitsubishi"
    ["Mercedes-Benz"]="mercedes"  # Normalized to match existing file
    ["BMW"]="bmw"
    ["Audi"]="audi"
    ["Hyundai"]="hyundai"
    ["Kia"]="kia"
    ["Isuzu"]="isuzu"
    ["Volkswagen"]="volkswagen"
    ["Chevrolet"]="chevrolet"
    ["Ford"]="ford"
    ["Jeep"]="jeep"
    ["Lexus"]="lexus"
    ["Land Rover"]="landrover"
    ["Tesla"]="tesla"
)

# Function to normalize brand name for URLs and filenames
normalize_name() {
    local brand="$1"
    # Convert to lowercase, remove spaces and special characters
    echo "$brand" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]//g'
}

# Function to check if file already exists
file_exists() {
    local filename="$1"
    if [ -f "$OUTPUT_DIR/$filename.svg" ]; then
        return 0
    fi
    return 1
}

# Function to create SVG file if download fails (fallback)
create_fallback_svg() {
    local brand="$1"
    local normalized="$2"
    local output_file="$OUTPUT_DIR/${normalized}.svg"

    # Generate colors for different brands
    local colors=(
        "CC0000" # Toyota red
        "000000" # Nissan black
        "003366" # Subaru blue
        "1D1D1D" # Mazda gray
        "CC0000" # Honda red
        "ED1B23" # Mitsubishi red
        "000000" # Mercedes black
        "0066B1" # BMW blue
        "F50500" # Audi orange
        "002C5F" # Hyundai blue
        "05141A" # Kia red
        "CC0000" # Isuzu red
        "1D1D1D" # Volkswagen gray
        "DAA520" # Chevrolet gold
        "003478" # Ford blue
        "000000" # Jeep black
        "000000" # Lexus black
        "003D71" # Land Rover green
        "CC0000" # Tesla red
    )

    # Pick a color based on brand name hash
    local hash=0
    local i=0
    while [ $i -lt ${#brand} ]; do
        local char="${brand:$i:1}"
        hash=$(( (hash * 31 + $(printf '%d' "'$char")) % ${#colors[@]}))
        i=$((i + 1))
    done
    local color="${colors[$hash]}"

    # Create simple SVG with brand name
    cat > "$output_file" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="5" y="5" width="90" height="90" rx="10" fill="#${color}"/>
  <text x="50" y="45" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Arial, sans-serif">$brand</text>
  <rect x="20" y="55" width="60" height="12" fill="none" stroke="white" stroke-width="2"/>
</svg>
EOF

    echo "  ✓ Created fallback SVG for: $brand"
    return 0
}

# Function to try fetching from multiple sources
fetch_logo() {
    local brand="$1"
    local normalized=$(normalize_name "$brand")
    local output_file="$OUTPUT_DIR/${normalized}.svg"

    # Check if file already exists and confirm replacement
    if file_exists "${normalized}"; then
        echo "File exists: ${normalized}.svg"
        echo "Replacing existing file..."
        rm -f "$output_file"
    fi

    echo "Fetching logo for: $brand"

    # Source 1: Wikimedia Commons (reliable for brand logos)
    local brand_slug=$(echo "$brand" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')
    local url1="https://upload.wikimedia.org/wikipedia/commons/2/25/${brand_slug}_logo.svg"
    if curl -f -s -L -m 10 -o "$output_file" "$url1" 2>/dev/null; then
        # Verify it's a valid SVG
        if grep -q "<svg" "$output_file" 2>/dev/null; then
            echo "  ✓ Downloaded from Wikimedia: $output_file"
            return 0
        else
            rm -f "$output_file"
        fi
    fi

    # Source 2: Brands of the World (CDN)
    local url2="https://cdn.jsdelivr.net/gh/gilbarbara/car-logos@main/logos/${brand_slug}.svg"
    if curl -f -s -L -m 10 -o "$output_file" "$url2" 2>/dev/null; then
        if grep -q "<svg" "$output_file" 2>/dev/null; then
            echo "  ✓ Downloaded from Brands of the World: $output_file"
            return 0
        else
            rm -f "$output_file"
        fi
    fi

    # Source 3: Try alternative naming
    local url3="https://cdn.jsdelivr.net/gh/gilbarbara/car-logos@main/logos/${normalized}.svg"
    if curl -f -s -L -m 10 -o "$output_file" "$url3" 2>/dev/null; then
        if grep -q "<svg" "$output_file" 2>/dev/null; then
            echo "  ✓ Downloaded from Alternative Source: $output_file"
            return 0
        else
            rm -f "$output_file"
        fi
    fi

    # If all downloads fail, create fallback SVG
    echo "  ✗ Failed to fetch $brand logo automatically"
    create_fallback_svg "$brand" "$normalized"
    return 1
}

# Function to move Isuzu.svg if it exists in wrong location
move_isuzu_if_exists() {
    local isuzu_locations=(
        "/workspaces/demo-car-yard/frontend/public/isuzu.svg"
        "/workspaces/demo-car-yard/frontend/isuzu.svg"
        "/workspaces/demo-car-yard/isuzu.svg"
    )

    for location in "${isuzu_locations[@]}"; do
        if [ -f "$location" ]; then
            echo "Moving Isuzu.svg from $location to $OUTPUT_DIR/isuzu.svg"
            mv "$location" "$OUTPUT_DIR/isuzu.svg"
            return 0
        fi
    done
    return 1
}

# Main execution
echo "=========================================="
echo "Car Brand Logo Fetcher"
echo "=========================================="
echo ""
echo "Output directory: $OUTPUT_DIR"
echo "Total brands: ${#BRAND_MAPPING[@]}"
echo ""

# Check and move Isuzu.svg if it's in wrong location
move_isuzu_if_exists

success_count=0
failed_count=0
failed_brands=()

# Fetch all logos
for brand in "${!BRAND_MAPPING[@]}"; do
    if fetch_logo "$brand"; then
        ((success_count++))
    else
        ((failed_count++))
        failed_brands+=("$brand")
    fi
    # Small delay to avoid rate limiting
    sleep 0.3
done

# Summary
echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo "Total brands:       ${#BRAND_MAPPING[@]}"
echo "Successfully fetched: $success_count"
echo "Failed (fallback created): $failed_count"

if [ ${#failed_brands[@]} -gt 0 ]; then
    echo ""
    echo "Brands with fallback logos created:"
    for brand in "${failed_brands[@]}"; do
        echo "  - $brand (fallback SVG created)"
    done
fi

echo ""
echo "Logos saved to: $OUTPUT_DIR/"
echo ""

# List all files in output directory
echo "Files in $OUTPUT_DIR:"
ls -lh "$OUTPUT_DIR" | tail -n +2

# Generate mapping file for reference
cat > "$OUTPUT_DIR/brand_mapping.txt" <<'EOF'
Brand Logo Mapping
==================

This file shows the mapping between brand names and their SVG filenames.

Toyota        -> toyota.svg
Nissan         -> nissan.svg
Subaru         -> subaru.svg
Mazda          -> mazda.svg
Honda          -> honda.svg
Mitsubishi     -> mitsubishi.svg
Mercedes-Benz  -> mercedes.svg
BMW            -> bmw.svg
Audi           -> audi.svg
Hyundai        -> hyundai.svg
Kia            -> kia.svg
Isuzu          -> isuzu.svg
Volkswagen      -> volkswagen.svg
Chevrolet      -> chevrolet.svg
Ford           -> ford.svg
Jeep           -> jeep.svg
Lexus          -> lexus.svg
Land Rover     -> landrover.svg
Tesla          -> tesla.svg

All SVGs are stored in: /workspaces/demo-car-yard/frontend/public/brands/
EOF

echo "Brand mapping saved to: $OUTPUT_DIR/brand_mapping.txt"
echo ""

echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo ""
echo "1. Check the downloaded logos in: $OUTPUT_DIR/"
echo "2. Manually download any missing logos from:"
echo "   https://www.google.com/search?q={brand}+logo+svg&tbm=isch"
echo "3. Save any manual downloads to: $OUTPUT_DIR/"
echo "   - Use lowercase filenames"
echo "   - No spaces or special characters"
echo "   - .svg extension required"
echo ""
echo "4. Update ShopByBrand.tsx BRAND_LOGOS mapping if filenames differ"
echo ""
echo "=========================================="
