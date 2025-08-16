document.getElementById("searchbtn").onclick = async function(){



    let query = document.getElementById("sreachInput").value;

    let response = await fetch(`http://www.localhost:3000/search?q=${query}`);
    let products = await response.json();



    let html = "";
    products.forEach(p => {
        html += `
            <div>
                <h3>${p.title}</h3>
                <p> Price : ${p.price}</p>
                <a href ="${p.link}" target ="_blank">Buy now</a>
            </div>
        `;
    });
    document.getElementById("results").innerHTML =html;
    console.log("the log :", html);
};

