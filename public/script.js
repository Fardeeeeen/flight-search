document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').innerHTML = '';
    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            origin: document.getElementById('origin').value,
            destination: document.getElementById('destination').value,
            cabin: document.getElementById('cabin').value
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading').style.display = 'none';
        let resultsDiv = document.getElementById('results');
        if (!data || data.length === 0) {
            resultsDiv.innerHTML = 'Try another search route.';
        } else {
            data.forEach(flight => {
                const businessTax = flight.min_business_tax !== null && flight.min_business_tax !== undefined ? '+' + '$' + flight.min_business_tax : '';
                const economyTax = flight.min_economy_tax !== null && flight.min_economy_tax !== undefined ? '+' + '$' + flight.min_economy_tax : '';
                const firstTax = flight.min_first_tax !== null && flight.min_first_tax !== undefined ? '+' + '$' + flight.min_first_tax : '';
                
                resultsDiv.innerHTML += `
                    <div class="flight">
                        <img src="/flight-logo.png" alt="Logo" style="width: 50px; height: auto; border-radius: 50px; margin-bottom: 15px;"/>
                        <h2>${flight.partner_program}</h2>
                        <h3>${document.getElementById('origin').value} → ${document.getElementById('destination').value}</h3>
                        <h1>${flight.min_business_miles !== null && flight.min_business_miles !== undefined ? flight.min_business_miles : 'N/A'}<span>${businessTax || ''}</span></h1>
                        <p>Min Business Miles</p>
                        <h1>${flight.min_economy_miles !== null && flight.min_economy_miles !== undefined ? flight.min_economy_miles : 'N/A'}  <span>${economyTax || ''}</span></h1>
                        <p>Economy Tax</p>
                        <h1>${flight.min_first_miles !== null && flight.min_first_miles !== undefined ? flight.min_first_miles : 'N/A'}  <span>${firstTax || ''}</span></h1>
                        <p>First Tax</p>
                    </div>
                `;
            });
        }
    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';
        console.error('Error:', error);
    });
});