/* This program is free software: you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public License
   as published by the Free Software Foundation, either version 3 of
   the License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


otp.namespace("otp.core");

otp.core.GeocoderInfomobility = otp.Class({

    url: null,
    addressParam: null,

    initialize: function (url, addressParam) {
        this.url = url;
        this.addressParam = addressParam;
    },

    geocode: function (address, setResultsCallback) {

        var params = {
            "format": "json",
            "addressdetails": 1,
            "limit": 10,
            "viewbox": "13.20900,42.46804,13.59901,42.21428",
            "bounded": 1,
            "accept-language": "it",
            "countrycodes": "it",
            "q": address,
        };
        //params[this.addressParam] = address;

        // Avoid out-of-order responses from the geocoding service. see #1419
        lastXhr = $.ajax(this.url, {
            data: params,
            type: "get",
            success: function (data, status, xhr) {
                if (xhr === lastXhr) {
                    if ((typeof data) == "string") data = JSON.parse(data);
                    var results = [];
                    data.forEach(function (item) {
                        //debugger;

                        //var resultObj = $(this);
                        const { road, house_number, village, city, county } = item.address;
                        const customAddress1 = [road, house_number].filter(i => i).join(', ');
                        const customAddress2 = [village, city, county].filter(i => i).join(', ');
                        let customDisplayName = [customAddress1, customAddress2].join(', ');
                        let customLabel;
                        // '-----' required to identify location name while rendering menu item
                        if(item.name && item.name !== road){
                            customLabel =  `<span class="geocoding-result-name">${item.name}</span><span class="geocoding-result-address">${customDisplayName}</span>`
                            customDisplayName = [item.name, customDisplayName].join(', ');
                        }else{
                            customLabel = `<span class="geocoding-result-name">${customAddress1}</span><span class="geocoding-result-address">${customAddress2}</span>`
                        }

                        var resultObj = {
                            //description : item.display_name,
                            description: customDisplayName,
                            customLabel,
                            lat: item.lat,
                            lng: item.lon
                        };
                        //console.log(resultObj)
                        results.push(resultObj);
                    });

                    setResultsCallback.call(this, results);
                }
            },
            error: function (err) {
                console.log(err)

            }
        });
    }

});
