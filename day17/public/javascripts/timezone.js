document.addEventListener('DOMContentLoaded', function() {
    const timezones = [
        {
            name: "USA/CANADA",
            zones: [
                { label: "Pacific Time 8:42pm", value: "America/Los_Angeles" },
                { label: "Mountain Time 9:42pm", value: "America/Denver" },
                { label: "Eastern Time 10:42pm", value: "America/New_York" },
                { label: "Atlantic Time 11:42pm", value: "America/Halifax" }
            ]
        },
        {
            name: "EUROPE",
            zones: [
                { label: "Berlin Time 8:42pm", value: "Europe/Berlin" },
                { label: "Helsinki Time 9:42pm", value: "Europe/Helsinki" },
                { label: "Dublin Time 10:42pm", value: "Europe/Dublin" },
                { label: "Samara Time 11:42pm", value: "Europe/Samara" }
            ]
        },
        {
            name: "ASIA",
            zones: [
                { label: "Hong Kong Time 8:42pm", value: "Asia/Hong_Kong" },
                { label: "Jakarta Time 9:42pm", value: "Asia/Jakarta" },
                { label: "Kabul Time 10:42pm", value: "Asia/Kabul" },
                { label: "Katmandu Time 11:42pm", value: "Asia/Katmandu" }
            ]
        },
        {
            name: "SOUTH AMERICA",
            zones: [
                { label: "Bogota Time 8:42pm", value: "America/Bogota" },
                { label: "Campo Grande Time 9:42pm", value: "America/Campo_Grande" },
                { label: "Caracas Time 10:42pm", value: "America/Caracas" },
                { label: "Lima Time 11:42pm", value: "America/Lima" }
            ]
        }
    ];

    const regionList = document.querySelector('.region-list');
    const timezoneSelect = document.getElementById('timezone-select');

    // Populate the timezone regions
    timezones.forEach(region => {
        const regionSection = document.createElement('div');
        regionSection.className = 'region-section';
        
        const regionHeader = document.createElement('h5');
        regionHeader.textContent = region.name;
        regionSection.appendChild(regionHeader);

        region.zones.forEach(zone => {
            const zoneItem = document.createElement('div');
            zoneItem.className = 'zone-item';
            
            // Create button for timezone selection
            const button = document.createElement('button');
            button.className = 'timezone-btn';
            button.setAttribute('type', 'button');
            button.setAttribute('aria-label', 'Select timezone ' + zone.label);
            // Style as a small ring (gray)
            button.style.width = '20px';
            button.style.height = '20px';
            button.style.borderRadius = '50%';
            button.style.padding = '0';
            button.style.marginRight = '10px';
            button.style.background = 'transparent';
            button.style.border = '2px solid #bbb';
            button.style.display = 'inline-block';
            button.style.verticalAlign = 'middle';
            button.style.cursor = 'pointer';

            // Highlight if selected
            const savedTimezone = localStorage.getItem('selectedTimezone');
            if (savedTimezone === zone.value) {
                button.style.border = '2px solid #0066ff';
            }

            button.addEventListener('click', () => {
                localStorage.setItem('selectedTimezone', zone.value);
                // Update all buttons to gray, then highlight selected
                document.querySelectorAll('.timezone-btn').forEach(btn => {
                    btn.style.border = '2px solid #bbb';
                });
                button.style.border = '2px solid #0066ff';
                window.location.href = '/calendar';
            });

            // Label for the timezone
            const label = document.createElement('span');
            label.textContent = zone.label;
            label.style.marginLeft = '10px';

            zoneItem.appendChild(button);
            zoneItem.appendChild(label);
            regionSection.appendChild(zoneItem);
        });

        regionList.appendChild(regionSection);
    });

    // Handle timezone selection
    function selectTimezone(timezone) {
        localStorage.setItem('selectedTimezone', timezone);
        window.location.href = '/calendar';
    }

    // Update select dropdown if timezone was previously selected
    const savedTimezone = localStorage.getItem('selectedTimezone');
    if (savedTimezone) {
        timezoneSelect.value = savedTimezone;
    }

    // Toggle for am/pm and 24hr (custom switch)
    const timeFormatToggle = document.getElementById('time-format-toggle');
    function setTimeFormat(format) {
        localStorage.setItem('timeFormat', format);
        timeFormatToggle.checked = (format === '24hr');
    }
    timeFormatToggle.addEventListener('change', function() {
        setTimeFormat(this.checked ? '24hr' : 'ampm');
    });
    // On load, set toggle state from localStorage
    const savedFormat = localStorage.getItem('timeFormat') || 'ampm';
    setTimeFormat(savedFormat);
});
