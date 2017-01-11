#!/bin/bash

countries=("AF" "AX" "AL" "DZ" "AS" "AD" "AO" "AI" "AQ" "AG" "AR" "AM" "AW" "AU" "AT" "AZ" "BS" "BH" "BD" "BB" "BY"
"BE" "BZ" "BJ" "BM" "BT" "BO" "BQ" "BA" "BW" "BV" "BR" "IO" "BN" "BG" "BF" "BI" "KH" "CM" "CA" "CV" "KY" "CF" "TD" "CL"
"CN" "CX" "CC" "CO" "KM" "CG" "CD" "CK" "CR" "CI" "HR" "CU" "CW" "CY" "CZ" "DK" "DJ" "DM" "DO" "EC" "EG" "SV" "GQ" "ER" "EE"
"ET" "FK" "FO" "FJ" "FI" "FR" "GF" "PF" "TF" "GA" "GM" "GE" "DE" "GH" "GI" "GR" "GL" "GD" "GP" "GU" "GT" "GG" "GN" "GW" "GY" "HT"
"HM" "VA" "HN" "HK" "HU" "IS" "IN" "ID" "IR" "IQ" "IE" "IM" "IL" "IT" "JM" "JP" "JE" "JO" "KZ" "KE" "KI" "KP" "KR" "KW" "KG" "LA"
"LV" "LB" "LS" "LR" "LY" "LI" "LT" "LU" "MO" "MK" "MG" "MW" "MY" "MV" "ML" "MT" "MH" "MQ" "MR" "MU" "YT" "MX" "FM" "MD" "MC" "MN"
"ME" "MS" "MA" "MZ" "MM" "NA" "NR" "NP" "NL" "NC" "NZ" "NI" "NE" "NG" "NU" "NF" "MP" "NO" "OM" "PK" "PW" "PS" "PA" "PG" "PY" "PE"
"PH" "PN" "PL" "PT" "PR" "QA" "RE" "RO" "RU" "RW" "BL" "SH" "KN" "LC" "MF" "PM" "VC" "WS" "SM" "ST" "SA" "SN" "RS" "SC" "SL" "SG"
"SX" "SK" "SI" "SB" "SO" "ZA" "GS" "SS" "ES" "LK" "SD" "SR" "SJ" "SZ" "SE" "CH" "SY" "TW" "TJ" "TZ" "TH" "TL" "TG" "TK" "TO" "TT"
"TN" "TR" "TM" "TC" "TV" "UG" "UA" "AE" "GB" "US" "UM" "UY" "UZ" "VU" "VE" "VN" "VG" "VI" "WF" "EH" "YE" "ZM" "ZW")

# create folder for api results
echo "Creating folder"
mkdir -p countries

echo "Downloading country specific data"
for i in "${countries[@]}"
do
  wget -O ./countries/$i.json 'http://api.meetup.com/2/cities?&sign=true&photo-host=public&country='$i
  echo $i
done

# Data format - [lat, lon, magnitude, lat, lon, magnitude ...]
# magnitude done over 100k, too big otherwise
jq -s '. | [.[].results[] | select(.member_count > 0) | .lat, .lon, .member_count / 100000]' ./countries/*.json > data.json

echo "All done"
