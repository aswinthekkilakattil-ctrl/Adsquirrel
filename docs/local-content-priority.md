# Local content priority list

Towns that get their own local content in [src/lib/local.mjs](../src/lib/local.mjs), in priority order. A place with local content is indexed by search engines whatever `PLACE_INDEX_TIER` says, so add a place only once its entry is complete and its facts are checked.

Order: Ernakulam and Thrissur first (our core market), then the remaining municipalities, then the busiest city neighbourhoods, then tourism and market towns.

Progress: all 325 places done (batch 1 plus the full queue), plus 50 extra Thrissur and Ernakulam places in batches 14 and 15 (see below). Batches 7–9 moved every Thrissur and Ernakulam place in the queue (ranks 151–154 and 271–325) ahead of other districts; batches 9–13 then covered ranks 155–270.

## Batch 1 (ranks 1–25, done)

- `thiruvananthapuram`
- `kochi`
- `kozhikode`
- `thrissur`
- `kollam`
- `kannur`
- `alappuzha`
- `kottayam`
- `palakkad`
- `malappuram`
- `kasaragod`
- `kalpetta`
- `irinjalakuda`
- `kodungallur-thrissur`
- `guruvayur`
- `chalakudy`
- `kunnamkulam-thrissur`
- `ernakulam-ernakulam`
- `north-paravur`
- `aluva-ernakulam`
- `kakkanad-ernakulam`
- `edappally`
- `kalamassery`
- `angamaly`
- `thrippunithura`

## Queue (ranks 26–325)

Batch 2 is ranks 26–50, batch 3 is 51–75 and batch 4 is 76–100, completing the top 100. Later batches continue in groups of 25.

| Rank | Batch | Place | District | Type | Slug | Group | Status |
|---:|---:|---|---|---|---|---|---|
| 26 | 2 | Thrikkakkara | Ernakulam | suburb | `thrikkakkara` | A | done |
| 27 | 2 | Maradu | Ernakulam | suburb | `maradu` | A | done |
| 28 | 2 | Eloor | Ernakulam | suburb | `eloor` | A | done |
| 29 | 2 | Muvattupuzha | Ernakulam | town | `muvattupuzha-ernakulam` | A | done |
| 30 | 2 | Perumbavoor | Ernakulam | town | `perumbavoor` | A | done |
| 31 | 2 | Kothamangalam | Ernakulam | town | `kothamangalam-ernakulam` | A | done |
| 32 | 2 | Piravom | Ernakulam | town | `piravom` | A | done |
| 33 | 2 | Koothattukulam | Ernakulam | town | `koothattukulam-ernakulam` | A | done |
| 34 | 2 | Chavakkad | Thrissur | town | `chavakkad-thrissur` | A | done |
| 35 | 2 | Wadakkancherry | Thrissur | town | `wadakkancherry` | A | done |
| 36 | 2 | Vyttila | Ernakulam | suburb | `vyttila` | A | done |
| 37 | 2 | Palarivattom | Ernakulam | suburb | `palarivattom` | A | done |
| 38 | 2 | Kaloor | Ernakulam | suburb | `kaloor` | A | done |
| 39 | 2 | Fort Kochi | Ernakulam | suburb | `fort-kochi` | A | done |
| 40 | 2 | Mattancherry | Ernakulam | suburb | `mattancherry` | A | done |
| 41 | 2 | Ollur | Thrissur | suburb | `ollur` | A | done |
| 42 | 2 | Kodakara | Thrissur | village | `kodakara` | A | done |
| 43 | 2 | Puthukkad | Thrissur | town | `puthukkad` | A | done |
| 44 | 2 | Mala | Thrissur | village | `mala` | A | done |
| 45 | 2 | Pathanamthitta | Pathanamthitta | town | `pathanamthitta-pathanamthitta` | A | done |
| 46 | 2 | Thodupuzha | Idukki | town | `thodupuzha-idukki` | A | done |
| 47 | 2 | Thiruvalla | Pathanamthitta | town | `thiruvalla-pathanamthitta` | A | done |
| 48 | 2 | Changanassery | Kottayam | town | `changanassery-kottayam` | A | done |
| 49 | 2 | Neyyattinkara | Thiruvananthapuram | village | `neyyattinkara-thiruvananthapuram` | B | done |
| 50 | 2 | Nedumangad | Thiruvananthapuram | town | `nedumangad-thiruvananthapuram` | B | done |
| 51 | 3 | Attingal | Thiruvananthapuram | town | `attingal` | B | done |
| 52 | 3 | Varkala | Thiruvananthapuram | town | `varkala-thiruvananthapuram` | B | done |
| 53 | 3 | Paravur | Kollam | town | `paravur-kollam` | B | done |
| 54 | 3 | Punalur | Kollam | town | `punalur-kollam` | B | done |
| 55 | 3 | Karunagappally | Kollam | census-town | `karunagappally-kollam` | B | done |
| 56 | 3 | Kottarakkara | Kollam | town | `kottarakkara-kollam` | B | done |
| 57 | 3 | Adoor | Pathanamthitta | town | `adoor-pathanamthitta` | B | done |
| 58 | 3 | Pandalam | Pathanamthitta | town | `pandalam` | B | done |
| 59 | 3 | Cherthala | Alappuzha | town | `cherthala-alappuzha` | B | done |
| 60 | 3 | Kayamkulam | Alappuzha | town | `kayamkulam` | B | done |
| 61 | 3 | Mavelikkara | Alappuzha | town | `mavelikkara-alappuzha` | B | done |
| 62 | 3 | Chengannur | Alappuzha | town | `chengannur-alappuzha` | B | done |
| 63 | 3 | Haripad | Alappuzha | town | `haripad` | B | done |
| 64 | 3 | Pala | Kottayam | town | `pala` | B | done |
| 65 | 3 | Vaikom | Kottayam | town | `vaikom-kottayam` | B | done |
| 66 | 3 | Ettumanoor | Kottayam | town | `ettumanoor` | B | done |
| 67 | 3 | Erattupetta | Kottayam | town | `erattupetta` | B | done |
| 68 | 3 | Kattappana | Idukki | town | `kattappana` | B | done |
| 69 | 3 | Ottapalam | Palakkad | town | `ottapalam` | B | done |
| 70 | 3 | Shoranur | Palakkad | town | `shoranur` | B | done |
| 71 | 3 | Chittur | Palakkad | suburb | `chittur-palakkad` | B | done |
| 72 | 3 | Mannarkkad | Palakkad | town | `mannarkkad` | B | done |
| 73 | 3 | Cherpulassery | Palakkad | town | `cherpulassery` | B | done |
| 74 | 3 | Pattambi | Palakkad | town | `pattambi-palakkad` | B | done |
| 75 | 3 | Manjeri | Malappuram | town | `manjeri` | B | done |
| 76 | 4 | Perinthalmanna | Malappuram | town | `perinthalmanna-malappuram` | B | done |
| 77 | 4 | Ponnani | Malappuram | town | `ponnani-malappuram` | B | done |
| 78 | 4 | Tirur | Malappuram | town | `tirur-malappuram` | B | done |
| 79 | 4 | Kottakkal | Malappuram | town | `kottakkal-malappuram` | B | done |
| 80 | 4 | Nilambur | Malappuram | town | `nilambur-malappuram` | B | done |
| 81 | 4 | Valanchery | Malappuram | town | `valanchery` | B | done |
| 82 | 4 | Kondotty | Malappuram | town | `kondotty-malappuram` | B | done |
| 83 | 4 | Parappanangadi | Malappuram | town | `parappanangadi` | B | done |
| 84 | 4 | Tanur | Malappuram | town | `tanur` | B | done |
| 85 | 4 | Tirurangadi | Malappuram | town | `tirurangadi-malappuram` | B | done |
| 86 | 4 | Vadakara | Kozhikode | town | `vadakara` | B | done |
| 87 | 4 | Koyilandy | Kozhikode | town | `koyilandy` | B | done |
| 88 | 4 | Ramanattukara | Kozhikode | town | `ramanattukara` | B | done |
| 89 | 4 | Feroke | Kozhikode | town | `feroke` | B | done |
| 90 | 4 | Mukkam | Kozhikode | town | `mukkam-kozhikode` | B | done |
| 91 | 4 | Koduvally | Kozhikode | town | `koduvally` | B | done |
| 92 | 4 | Payyoli | Kozhikode | village | `payyoli` | B | done |
| 93 | 4 | Mananthavady | Wayanad | town | `mananthavady-wayanad` | B | done |
| 94 | 4 | Sultan Bathery | Wayanad | town | `sultan-bathery` | B | done |
| 95 | 4 | Thalassery | Kannur | town | `thalassery-kannur` | B | done |
| 96 | 4 | Payyanur | Kannur | town | `payyanur` | B | done |
| 97 | 4 | Taliparamba | Kannur | town | `taliparamba-kannur` | B | done |
| 98 | 4 | Mattannur | Kannur | town | `mattannur` | B | done |
| 99 | 4 | Kuthuparamba | Kannur | village | `kuthuparamba` | B | done |
| 100 | 4 | Iritty | Kannur | town | `iritty-kannur` | B | done |
| 101 | 5 | Panoor | Kannur | town | `panoor-kannur` | B | done |
| 102 | 5 | Anthoor | Kannur | town | `anthoor` | B | done |
| 103 | 5 | Sreekandapuram | Kannur | town | `sreekandapuram` | B | done |
| 104 | 5 | Kanhangad | Kasaragod | town | `kanhangad` | B | done |
| 105 | 5 | Nileshwaram | Kasaragod | town | `nileshwaram` | B | done |
| 106 | 5 | Elamakkara | Ernakulam | suburb | `elamakkara` | C | done |
| 107 | 5 | Vaduthala | Ernakulam | suburb | `vaduthala-ernakulam` | C | done |
| 108 | 5 | Thammanam | Ernakulam | suburb | `thammanam` | C | done |
| 109 | 5 | Pachalam | Ernakulam | suburb | `pachalam` | C | done |
| 110 | 5 | Thoppumpady | Ernakulam | suburb | `thoppumpady` | C | done |
| 111 | 5 | Palluruthy | Ernakulam | suburb | `palluruthy` | C | done |
| 112 | 5 | Cheranallor | Ernakulam | suburb | `cheranallor` | C | done |
| 113 | 5 | Varappuzha | Ernakulam | suburb | `varappuzha` | C | done |
| 114 | 5 | Nedumbassery | Ernakulam | census-town | `nedumbassery` | C | done |
| 115 | 5 | Kalady | Ernakulam | town | `kalady-ernakulam` | C | done |
| 116 | 5 | Kolenchery | Ernakulam | town | `kolenchery` | C | done |
| 117 | 5 | Pattimattom | Ernakulam | village | `pattimattom` | C | done |
| 118 | 5 | Kizhakkambalam | Ernakulam | village | `kizhakkambalam` | C | done |
| 119 | 5 | Cherai | Ernakulam | town | `cherai` | C | done |
| 120 | 5 | Chottanikkara | Ernakulam | suburb | `chottanikkara` | C | done |
| 121 | 5 | Mulanthuruthy | Ernakulam | village | `mulanthuruthy` | C | done |
| 122 | 5 | Udayamperoor | Ernakulam | village | `udayamperoor` | C | done |
| 123 | 5 | Edathala | Ernakulam | village | `edathala` | C | done |
| 124 | 5 | Puthencruz | Ernakulam | town | `puthencruz` | C | done |
| 125 | 5 | Vazhakulam | Ernakulam | census-town | `vazhakulam` | C | done |
| 126 | 6 | Kuruppampady | Ernakulam | village | `kuruppampady` | C | done |
| 127 | 6 | Malayattoor | Ernakulam | village | `malayattoor` | C | done |
| 128 | 6 | Mulavukad | Ernakulam | census-town | `mulavukad` | C | done |
| 129 | 6 | Kumbalangy | Ernakulam | census-town | `kumbalangy` | C | done |
| 130 | 6 | Poothole | Thrissur | suburb | `poothole` | C | done |
| 131 | 6 | Punkunnam | Thrissur | suburb | `punkunnam` | C | done |
| 132 | 6 | Ayyanthole | Thrissur | suburb | `ayyanthole` | C | done |
| 133 | 6 | Kuriyachira | Thrissur | suburb | `kuriyachira` | C | done |
| 134 | 6 | Viyyur | Thrissur | village | `viyyur-thrissur` | C | done |
| 135 | 6 | Peramangalam | Thrissur | census-town | `peramangalam` | C | done |
| 136 | 6 | Puzhakkal | Thrissur | suburb | `puzhakkal` | C | done |
| 137 | 6 | West Fort | Thrissur | suburb | `west-fort-thrissur` | C | done |
| 138 | 6 | Thriprayar | Thrissur | town | `thriprayar` | C | done |
| 139 | 6 | Vadanappally | Thrissur | census-town | `vadanappally` | C | done |
| 140 | 6 | Chelakkara | Thrissur | census-town | `chelakkara` | C | done |
| 141 | 6 | Pazhayannur | Thrissur | village | `pazhayannur` | C | done |
| 142 | 6 | Cherpu | Thrissur | census-town | `cherpu` | C | done |
| 143 | 6 | Kattoor | Thrissur | village | `kattoor-thrissur` | C | done |
| 144 | 6 | Koratty | Thrissur | village | `koratty-thrissur` | C | done |
| 145 | 6 | Kaipamangalam | Thrissur | census-town | `kaipamangalam` | C | done |
| 146 | 6 | Mathilakam | Thrissur | village | `mathilakam` | C | done |
| 147 | 6 | Engandiyur | Thrissur | village | `engandiyur` | C | done |
| 148 | 6 | Valapad | Thrissur | village | `valapad` | C | done |
| 149 | 6 | Nattika | Thrissur | village | `nattika` | C | done |
| 150 | 6 | Pavaratty | Thrissur | census-town | `pavaratty` | C | done |
| 151 | 7 | Kandassankadavu | Thrissur | quarter | `kandassankadavu` | C | done |
| 152 | 7 | Amballur | Thrissur | census-town | `amballur-thrissur` | C | done |
| 153 | 7 | Vellangallur | Thrissur | village | `vellangallur` | C | done |
| 154 | 7 | Athirappilly | Thrissur | village | `athirappilly` | C | done |
| 155 | 7 | Kazhakkoottam | Thiruvananthapuram | suburb | `kazhakkoottam` | C | done |
| 156 | 7 | Pattom | Thiruvananthapuram | suburb | `pattom` | C | done |
| 157 | 7 | Kowdiar | Thiruvananthapuram | suburb | `kowdiar` | C | done |
| 158 | 7 | Vazhuthacaud | Thiruvananthapuram | suburb | `vazhuthacaud` | C | done |
| 159 | 7 | Peroorkada | Thiruvananthapuram | suburb | `peroorkada` | C | done |
| 160 | 7 | Sreekariyam | Thiruvananthapuram | suburb | `sreekariyam` | C | done |
| 161 | 7 | Kovalam | Thiruvananthapuram | suburb | `kovalam` | C | done |
| 162 | 7 | Vizhinjam | Thiruvananthapuram | suburb | `vizhinjam` | C | done |
| 163 | 7 | Balaramapuram | Thiruvananthapuram | town | `balaramapuram` | C | done |
| 164 | 7 | Kattakada | Thiruvananthapuram | town | `kattakada` | C | done |
| 165 | 7 | Venjaramoodu | Thiruvananthapuram | town | `venjaramoodu` | C | done |
| 166 | 7 | Ulloor | Thiruvananthapuram | suburb | `ulloor` | C | done |
| 167 | 7 | Nemom | Thiruvananthapuram | suburb | `nemom` | C | done |
| 168 | 7 | Pothencode | Thiruvananthapuram | suburb | `pothencode` | C | done |
| 169 | 7 | Kesavadasapuram | Thiruvananthapuram | suburb | `kesavadasapuram` | C | done |
| 170 | 7 | Vellayambalam | Thiruvananthapuram | suburb | `vellayambalam` | C | done |
| 171 | 7 | Sasthamangalam | Thiruvananthapuram | suburb | `sasthamangalam` | C | done |
| 172 | 7 | Kallambalam | Thiruvananthapuram | town | `kallambalam` | C | done |
| 173 | 7 | Parassala | Thiruvananthapuram | town | `parassala` | C | done |
| 174 | 7 | Vattiyoorkavu | Thiruvananthapuram | suburb | `vattiyoorkavu` | C | done |
| 175 | 7 | Nadakkavu | Kozhikode | suburb | `nadakkavu-kozhikode` | C | done |
| 176 | 8 | Chevayur | Kozhikode | village | `chevayur` | C | done |
| 177 | 8 | West Hill | Kozhikode | suburb | `west-hill` | C | done |
| 178 | 8 | Mavoor | Kozhikode | town | `mavoor` | C | done |
| 179 | 8 | Kunnamangalam | Kozhikode | census-town | `kunnamangalam` | C | done |
| 180 | 8 | Thamarassery | Kozhikode | town | `thamarassery-kozhikode` | C | done |
| 181 | 8 | Balusseri | Kozhikode | town | `balusseri` | C | done |
| 182 | 8 | Perambra | Kozhikode | town | `perambra-kozhikode` | C | done |
| 183 | 8 | Nadapuram | Kozhikode | town | `nadapuram` | C | done |
| 184 | 8 | Kuttiadi | Kozhikode | town | `kuttiadi` | C | done |
| 185 | 8 | Beypore | Kozhikode | town | `beypore` | C | done |
| 186 | 8 | Kakkodi | Kozhikode | census-town | `kakkodi` | C | done |
| 187 | 8 | Chavara | Kollam | census-town | `chavara` | C | done |
| 188 | 8 | Kundara | Kollam | town | `kundara` | C | done |
| 189 | 8 | Pathanapuram | Kollam | town | `pathanapuram-kollam` | C | done |
| 190 | 8 | Anchal | Kollam | town | `anchal` | C | done |
| 191 | 8 | Sasthamkotta | Kollam | town | `sasthamkotta` | C | done |
| 192 | 8 | Chathannoor | Kollam | town | `chathannoor` | C | done |
| 193 | 8 | Kadakkal | Kollam | town | `kadakkal` | C | done |
| 194 | 8 | Kottiyam | Kollam | town | `kottiyam` | C | done |
| 195 | 8 | Pazhayangadi | Kannur | town | `pazhayangadi` | C | done |
| 196 | 8 | Alakode | Kannur | town | `alakode` | C | done |
| 197 | 8 | Peravoor | Kannur | town | `peravoor` | C | done |
| 198 | 8 | Azhikode | Kannur | village | `azhikode-kannur` | C | done |
| 199 | 8 | Kalavoor | Alappuzha | neighbourhood | `kalavoor` | C | done |
| 200 | 8 | Ambalappuzha | Alappuzha | town | `ambalappuzha-alappuzha` | C | done |
| 201 | 9 | Thuravoor | Alappuzha | village | `thuravoor-alappuzha` | C | done |
| 202 | 9 | Aroor | Alappuzha | suburb | `aroor` | C | done |
| 203 | 9 | Mannar | Alappuzha | census-town | `mannar` | C | done |
| 204 | 9 | Edathua | Alappuzha | village | `edathua` | C | done |
| 205 | 9 | Kuttanad | Alappuzha | taluk | `kuttanad-taluk` | C | done |
| 206 | 9 | Mararikkulam | Alappuzha | village | `mararikkulam` | C | done |
| 207 | 9 | Mannanchery | Alappuzha | census-town | `mannanchery` | C | done |
| 208 | 9 | Kumarakom | Kottayam | village | `kumarakom` | C | done |
| 209 | 9 | Kanjirappally | Kottayam | town | `kanjirappally-kottayam` | C | done |
| 210 | 9 | Mundakayam | Kottayam | village | `mundakayam` | C | done |
| 211 | 9 | Pampady | Kottayam | town | `pampady-kottayam` | C | done |
| 212 | 9 | Kuravilangad | Kottayam | town | `kuravilangad` | C | done |
| 213 | 9 | Ponkunnam | Kottayam | town | `ponkunnam` | C | done |
| 214 | 9 | Puthuppally | Kottayam | town | `puthuppally-kottayam` | C | done |
| 215 | 9 | Kaduthuruthy | Kottayam | suburb | `kaduthuruthy` | C | done |
| 216 | 9 | Uzhavoor | Kottayam | village | `uzhavoor` | C | done |
| 217 | 9 | Munnar | Idukki | town | `munnar` | D | done |
| 218 | 9 | Kumily | Idukki | town | `kumily` | D | done |
| 219 | 9 | Adimali | Idukki | town | `adimali` | D | done |
| 220 | 9 | Nedumkandam | Idukki | town | `nedumkandam` | D | done |
| 221 | 9 | Painavu | Idukki | town | `painavu` | D | done |
| 222 | 9 | Vandiperiyar | Idukki | town | `vandiperiyar` | D | done |
| 223 | 9 | Peermade | Idukki | town | `peermade` | D | done |
| 224 | 9 | Rajakkad | Idukki | village | `rajakkad` | D | done |
| 225 | 9 | Vagamon | Idukki | town | `vagamon` | D | done |
| 226 | 10 | Cheruthoni | Idukki | town | `cheruthoni` | D | done |
| 227 | 10 | Ranni | Pathanamthitta | town | `ranni-pathanamthitta` | D | done |
| 228 | 10 | Kozhencherry | Pathanamthitta | town | `kozhencherry` | D | done |
| 229 | 10 | Konni | Pathanamthitta | town | `konni-pathanamthitta` | D | done |
| 230 | 10 | Mallappally | Pathanamthitta | town | `mallappally-pathanamthitta` | D | done |
| 231 | 10 | Aranmula | Pathanamthitta | village | `aranmula` | D | done |
| 232 | 10 | Kumbanad | Pathanamthitta | town | `kumbanad` | D | done |
| 233 | 10 | Enathu | Pathanamthitta | village | `enathu` | D | done |
| 234 | 10 | Seethathodu | Pathanamthitta | village | `seethathodu` | D | done |
| 235 | 10 | Alathur | Palakkad | census-town | `alathur-palakkad` | D | done |
| 236 | 10 | Vadakkenchery | Palakkad | town | `vadakkenchery` | D | done |
| 237 | 10 | Kollengode | Palakkad | town | `kollengode` | D | done |
| 238 | 10 | Nemmara | Palakkad | village | `nemmara` | D | done |
| 239 | 10 | Kanjikode | Palakkad | town | `kanjikode` | D | done |
| 240 | 10 | Walayar | Palakkad | village | `walayar` | D | done |
| 241 | 10 | Kongad | Palakkad | village | `kongad` | D | done |
| 242 | 10 | Malampuzha | Palakkad | village | `malampuzha` | D | done |
| 243 | 10 | Agali | Palakkad | village | `agali` | D | done |
| 244 | 10 | Koduvayur | Palakkad | village | `koduvayur` | D | done |
| 245 | 10 | Edappal | Malappuram | census-town | `edappal` | D | done |
| 246 | 10 | Areekode | Malappuram | town | `areekode` | D | done |
| 247 | 10 | Wandoor | Malappuram | town | `wandoor` | D | done |
| 248 | 10 | Kuttippuram | Malappuram | town | `kuttippuram` | D | done |
| 249 | 10 | Changaramkulam | Malappuram | village | `changaramkulam` | D | done |
| 250 | 10 | Vengara | Malappuram | town | `vengara-malappuram` | D | done |
| 251 | 11 | Edavanna | Malappuram | village | `edavanna` | D | done |
| 252 | 11 | Pandikkad | Malappuram | village | `pandikkad` | D | done |
| 253 | 11 | Chemmad | Malappuram | suburb | `chemmad` | D | done |
| 254 | 11 | Kalikavu | Malappuram | town | `kalikavu-malappuram` | D | done |
| 255 | 11 | Angadipuram | Malappuram | village | `angadipuram` | D | done |
| 256 | 11 | Karuvarakundu | Malappuram | village | `karuvarakundu` | D | done |
| 257 | 11 | Meppadi | Wayanad | village | `meppadi` | D | done |
| 258 | 11 | Vythiri | Wayanad | village | `vythiri-wayanad` | D | done |
| 259 | 11 | Pulpalli | Wayanad | village | `pulpalli` | D | done |
| 260 | 11 | Panamaram | Wayanad | town | `panamaram` | D | done |
| 261 | 11 | Meenangadi | Wayanad | village | `meenangadi` | D | done |
| 262 | 11 | Ambalavayal | Wayanad | village | `ambalavayal` | D | done |
| 263 | 11 | Thalappuzha | Wayanad | village | `thalappuzha` | D | done |
| 264 | 11 | Uppala | Kasaragod | town | `uppala` | D | done |
| 265 | 11 | Manjeshwar | Kasaragod | town | `manjeshwar` | D | done |
| 266 | 11 | Cheruvathur | Kasaragod | town | `cheruvathur` | D | done |
| 267 | 11 | Bekal | Kasaragod | village | `bekal` | D | done |
| 268 | 11 | Udma | Kasaragod | census-town | `udma` | D | done |
| 269 | 11 | Mulleria | Kasaragod | town | `mulleria` | D | done |
| 270 | 11 | Pallikere | Kasaragod | village | `pallikere` | D | done |
| 271 | 11 | Chengamanad | Ernakulam | census-town | `chengamanad` | D | done |
| 272 | 11 | Kothad | Ernakulam | suburb | `kothad` | D | done |
| 273 | 11 | Eroor | Ernakulam | suburb | `eroor-ernakulam` | D | done |
| 274 | 11 | Irumpanam | Ernakulam | suburb | `irumpanam` | D | done |
| 275 | 11 | Manjummel | Ernakulam | suburb | `manjummel` | D | done |
| 276 | 12 | Thykoodam | Ernakulam | suburb | `thykoodam` | D | done |
| 277 | 12 | Ponnurunni | Ernakulam | suburb | `ponnurunni` | D | done |
| 278 | 12 | Kumbalam | Ernakulam | census-town | `kumbalam-ernakulam` | D | done |
| 279 | 12 | Kadamakkudy | Ernakulam | suburb | `kadamakkudy` | D | done |
| 280 | 12 | Vallarpadam | Ernakulam | suburb | `vallarpadam` | D | done |
| 281 | 12 | Ernakulam North | Ernakulam | suburb | `ernakulam-north` | D | done |
| 282 | 12 | Ernakulam South | Ernakulam | suburb | `ernakulam-south` | D | done |
| 283 | 12 | Pallikkara | Ernakulam | village | `pallikkara-ernakulam` | D | done |
| 284 | 12 | Mookkannoor | Ernakulam | village | `mookkannoor` | D | done |
| 285 | 12 | Karukutty | Ernakulam | village | `karukutty` | D | done |
| 286 | 12 | Vengola | Ernakulam | census-town | `vengola` | D | done |
| 287 | 12 | Rayamangalam | Ernakulam | village | `rayamangalam` | D | done |
| 288 | 12 | Asamannoor | Ernakulam | village | `asamannoor` | D | done |
| 289 | 12 | Pothanicad | Ernakulam | village | `pothanicad` | D | done |
| 290 | 12 | Kavalangad | Ernakulam | village | `kavalangad` | D | done |
| 291 | 12 | Neriamangalam | Ernakulam | town | `neriamangalam` | D | done |
| 292 | 12 | Edavanakkad | Ernakulam | village | `edavanakkad` | D | done |
| 293 | 12 | Elamkunnapuzha | Ernakulam | census-town | `elamkunnapuzha` | D | done |
| 294 | 12 | Thalikulam | Thrissur | village | `thalikulam` | D | done |
| 295 | 12 | Pullur | Thrissur | census-town | `pullur-thrissur` | D | done |
| 296 | 12 | Arimbur | Thrissur | village | `arimbur` | D | done |
| 297 | 12 | Nadathara | Thrissur | suburb | `nadathara` | D | done |
| 298 | 12 | Peechi | Thrissur | village | `peechi` | D | done |
| 299 | 12 | Kolazhy | Thrissur | census-town | `kolazhy` | D | done |
| 300 | 12 | Vellanikkara | Thrissur | suburb | `vellanikkara` | D | done |
| 301 | 13 | Kaiparamba | Thrissur | census-town | `kaiparamba` | D | done |
| 302 | 13 | Edathiruthy | Thrissur | census-town | `edathiruthy` | D | done |
| 303 | 13 | annamanada | Thrissur | locality | `annamanada` | D | done |
| 304 | 13 | Kuzhur | Thrissur | quarter | `kuzhur` | D | done |
| 305 | 13 | Puthenchira | Thrissur | village | `puthenchira` | D | done |
| 306 | 13 | Eriyad | Thrissur | village | `eriyad` | D | done |
| 307 | 13 | Methala | Thrissur | census-town | `methala` | D | done |
| 308 | 13 | Alur | Thrissur | village | `alur` | D | done |
| 309 | 13 | Chiyyaram | Thrissur | village | `chiyyaram` | D | done |
| 310 | 13 | Ollukkara | Thrissur | village | `ollukkara` | D | done |
| 311 | 13 | Kadappuram | Thrissur | village | `kadappuram` | D | done |
| 312 | 13 | Orumanayur | Thrissur | census-town | `orumanayur` | D | done |
| 313 | 13 | Kunnathunad | Ernakulam | census-town | `kunnathunad-ernakulam` | E | done |
| 314 | 13 | Mazhuvannoor | Ernakulam | village | `mazhuvannoor` | E | done |
| 315 | 13 | Ayavana | Ernakulam | village | `ayavana` | E | done |
| 316 | 13 | Kalloorkad | Ernakulam | village | `kalloorkad` | E | done |
| 317 | 13 | Pampakuda | Ernakulam | village | `pampakuda` | E | done |
| 318 | 13 | Ramamangalam | Ernakulam | village | `ramamangalam` | E | done |
| 319 | 13 | Thirumarady | Ernakulam | village | `thirumarady` | E | done |
| 320 | 13 | Chendamangalam | Ernakulam | census-town | `chendamangalam` | E | done |
| 321 | 13 | Kottuvally | Ernakulam | census-town | `kottuvally` | E | done |
| 322 | 13 | Ezhikkara | Ernakulam | village | `ezhikkara` | E | done |
| 323 | 13 | Alangad | Ernakulam | census-town | `alangad-ernakulam` | E | done |
| 324 | 13 | Kadungalloor | Ernakulam | census-town | `kadungalloor` | E | done |
| 325 | 13 | Karumalloor | Ernakulam | census-town | `karumalloor` | E | done |

Groups: **A** Ernakulam and Thrissur municipalities and busy areas, other priority towns · **B** Other municipalities · **C** City neighbourhoods and suburbs · **D** Tourism and market towns · **E** Further Ernakulam and Thrissur towns.

## Batch 14 (extra Thrissur and Ernakulam places, done)

Chosen from the place data after the queue was finished, favouring places people search for by name.

- Ernakulam: `njarackal`, `thiruvankulam`, `choornikkara`, `elamkulam-ernakulam`, `mundamveli`, `chembumukku`, `vazhakkala`, `chittoor-ernakulam`, `koovappady`, `mattoor`, `moothakunnam`, `puthenvelikkara`
- Thrissur: `anthicad`, `nenmenikkara`, `trikkur`, `vallachira`, `cheruthuruthi`, `desamangalam`, `punnayurkulam`, `thiruvanchikulam`, `kottapuram-thrissur`, `mammiyoor`, `potta`, `kadavallur`, `kallettumkara`

## Batch 15 (extra Thrissur and Ernakulam places, done)

Smaller places, each written around its own main kind of business so the pages stay distinct.

- Ernakulam: `edachira`, `thengode`, `kangarappady`, `vallam`, `pathalam`, `padivattom`, `koovapadam`, `perumpadappu-ernakulam`, `amballur-ernakulam`, `eramalloor-ernakulam`, `vadakkekara-ernakulam`, `kizhakkekara-ernakulam`, `velloorkunnam`
- Thrissur: `puranattukara`, `puthur-thrissur`, `oorakam-thrissur`, `manalur`, `chittilappilly`, `adat`, `perinjanam`, `edakkazhiyur`, `choondal-thrissur`, `chelakkottukara`, `ottupara`, `parappukkara`

## Not in the place data yet

Real, searched places that the sourced dataset does not contain under any spelling, or only as an unsourced neighbourhood record. Each needs a sourced entry in `src/data/places.json` (with an OpenStreetMap or LGD reference) before it can get a page:

- Kadavanthra(Ernakulam)
- Panampilly Nagar (Ernakulam)
- Thevara (Ernakulam)
- Vennala (Ernakulam)
- ~~Njarakkal (Ernakulam)~~ in the data as `njarackal`; done in batch 14
- Nettoor (Ernakulam)
- Kundannoor (Ernakulam)
- Vypin(Ernakulam)
- Mannuthy (Thrissur): only an OpenStreetMap neighbourhood record (`mannuthy`), which the indexing rules never index; needs a sourced settlement record
- Kechery (Thrissur)
- ~~Anthikad (Thrissur)~~ in the data as `anthicad`; done in batch 14
- Chakkarakkal (Kannur)
- Dharmadam (Kannur)
- ~~Tiruvalla (Pathanamthitta)~~ in the data as `thiruvalla-pathanamthitta`; not written yet
- Puthanathani (Malappuram)
- Alathiyur (Malappuram)
- Trikaripur (Kasaragod)
- Kumbla (Kasaragod)
- Badiadka (Kasaragod)
- Chilavannoor (Ernakulam)
- Panangad (Ernakulam)
- Aroor (Ernakulam)
- Okkal (Ernakulam)
- Paipra (Ernakulam)
- Ramavarmapuram (Thrissur)
- Mulamkunnathukavu (Thrissur)
- Erumapetty (Thrissur)
- Vatanappally (Thrissur)
- Vadavucode (Ernakulam)
- Sreemoolanagaram (Ernakulam)
- Chowannur (Thrissur)
- Nenmanikkara (Thrissur)
- Padiyoor (Thrissur)
