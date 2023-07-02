#!/bin/bash

certificates=$(certbot certificates)

while IFS= read -r line; do
  if [[ $line =~ "Certificate Name:" ]]; then
    certificate_name=$(echo "$line" | awk -F': ' '{print $2}')
  elif [[ $line =~ "Expiry Date:" ]]; then
    expiry_date=$(echo "$line" | grep -oP "Expiry Date: \K.*")

    if [ $(date -d "${expiry_date}" +%s) -lt $(date +%s) ]; then
      echo "Certificate $certificate_name has already expired, running renew command..."
      certbot renew --cert-name "$certificate_name"
    else
      echo "Certificate $certificate_name is still valid, no action needed."
    fi
  fi
done <<< "$certificates"
