const productsDOM = document.querySelector(".grid-container");
const searchAndAddDOM = document.querySelector(".search-add-container");

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const searchAndAdd = new SearchAndAdd();

  products.getProducts();
  searchAndAdd.createSearchAndAdd();
});

class Products {
  async getProducts() {
    try {
      await fetch("http://127.0.0.1:5000/Products", {
        method: "GET",
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          createProductTable(data);
        });
    } catch (error) {
      console.log(error);
    }
  }
}

function createProductTable(data) {
  if (data.length < 1) {
    productsDOM.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="grid-item">
        <div class="product-tables">
        No Product Found
        </div>
      </div
      `
    );
  }
  for (let i = 0; i < data.length; i++) {
    productsDOM.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="grid-item">
        <div class= "product-tables">
            <div class="col-md-4 customCard">
              <div class="card mb-4 align-items-center" style="display: table-caption; background-color: antiquewhite; border: none" >
                <div class="row" data-title="Product Name" style="display: contents">
                  ${data[i].name}
                </div>
                <div class="row" data-title="Product Image Link">
                <img src="${data[i].link}" alt="image link" style="height: 200px">
                </div>
                <p>
                  Price €
                  <input id=item-price-${i} type="number" min="0" value="${data[i].price}" title="${data[i]._id}">
                  <button type ="button" class="btn"  onclick="updatePrice(document.getElementById('item-price-${i}'))" style="background-color: green ; margin-right: 10px">Update Price €</button>
                </p>
                <p>
                  Stock Count
                  <input id=item-stock-${i} type="number" min="0" value="${data[i].stock}" title="${data[i]._id}">
                  <button type ="button" class="btn"  onclick="updateStock(document.getElementById('item-stock-${i}'))" style="background-color: green ; margin-right: 10px">Update Stock Count</button>
                </p>
                <button id=item-delete-${i} type="button" class="btn" onclick="deleteProduct(document.getElementById('item-delete-${i}'))" style="background-color: red" title="${data[i]._id}">Delete Product</button>
                </div>
              </div> 
            </div> 
            </div>
        </div>    
        `
    );
  }
}

async function updatePrice(event) {
  try {
    await fetch("http://127.0.0.1:5000/UpdatePrice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: event.title,
        price: document.getElementById(event.id).value,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {});
  } catch (error) {
    console.log(error);
  }
}

async function updateStock(event) {
  try {
    await fetch("http://127.0.0.1:5000/UpdateStock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: event.title,
        stock: document.getElementById(event.id).value,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {});
  } catch (error) {
    console.log(error);
  }
}

async function deleteProduct(event) {
  deleteProductTable();
  try {
    await fetch("http://127.0.0.1:5000/DeleteProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: event.title,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        createProductTable(data);
      });
  } catch (error) {
    console.log(error);
  }
}

class SearchAndAdd {
  async createSearchAndAdd() {
    searchAndAddDOM.insertAdjacentHTML(
      "afterbegin",
      `
      <p>
        <input id=search-input type="text">
        <button type ="button" onclick="searchProduct()" style="background-color: honeydew ; margin-right: 10px">Search by Name</button>
        <button class="open-button" onclick="openForm()">Add Product</button>
        <div class="form-popup" id="myForm">
          <form class="form-container">
            <h1>Add Product</h1>

            <label for="form-product-name"><b>Product Name</b></label>
            <input
              id="form-product-name"
              type="text"
              placeholder="Enter Product Name"
              name="form-product-name"
              required
            />

            <label for="form-product-image-link"><b>Product Image Link</b></label>
            <input
              id="form-product-image-link"
              type="text"
              placeholder="Enter Product Image Link"
              name="form-product-image-link"
              required
            />

            <label for="form-product-price"><b>Product Price €</b></label>
            <input
              id="form-product-price"
              type="number" min="0"
              placeholder="Enter Product Price"
              name="form-product-price"
              required
            />

            <label for="form-product-stock"><b>Product Stock Count</b></label>
            <input
              id="form-product-stock"
              type="number" min="0"
              placeholder="Enter Product Stock"
              name="form-product-stock"
              required
            />

            <button type="button" class="btn" onclick="addProductForm()">Add Product </button>
            <button type="button" class="btn" onclick="closeForm()" style="background-color: red"> Cancel</button>
          </form>
        </div>
        </p>
      `
    );
  }
}

async function searchProduct() {
  try {
    await fetch("http://127.0.0.1:5000/SearchProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: document.getElementById("search-input").value,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        deleteProductTable();
        createProductTable(data);
      });
  } catch (error) {
    console.log(error);
  }
}

function deleteProductTable() {
  let elements = document.getElementsByClassName("grid-item");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

async function addProductForm() {
  deleteProductTable();
  if (
    document.getElementById("form-product-name").value != "" &&
    document.getElementById("form-product-image-link").value != "" &&
    document.getElementById("form-product-price").value != "" &&
    document.getElementById("form-product-stock").value != ""
  ) {
    try {
      await fetch("http://127.0.0.1:5000/AddProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: document.getElementById("form-product-name").value,
          link: document.getElementById("form-product-image-link").value,
          price: document.getElementById("form-product-price").value,
          stock: document.getElementById("form-product-stock").value,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          document.getElementById("form-product-name").value = "";
          document.getElementById("form-product-image-link").value = "";
          document.getElementById("form-product-price").value = "";
          document.getElementById("form-product-stock").value = "";

          createProductTable(data);
        });
    } catch (error) {
      console.log(error);
    }
  }
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}
