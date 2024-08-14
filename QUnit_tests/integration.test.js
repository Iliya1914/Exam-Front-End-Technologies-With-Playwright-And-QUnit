const baseUrl = "http://localhost:3030";

let user = {
  email: "",
  password: "123456",
};

let myAlbum = {
  name: "",
  artist: "Unknown",
  description: "",
  genre: "Random genre",
  imgUrl: "../../images/pinkFloyd.jpg",
  price: "15.25",
  releaseDate: "29 June 2024",
};

function random() {
  return Math.floor(Math.random() * 10000);
}

let token = "";
let userId = "";
let lastCreatedAlbumId = "";

QUnit.config.reorder = false;

QUnit.module("User Functionality", () => {
  QUnit.test("Register", async (assert) => {
    // Arrange
    const path = "/users/register";
    user.email = `abv${random()}@abv.bg`;

    // Act
    let response = await fetch(baseUrl + path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(user),
    });
    let json = await response.json();
    // console.log(json);

    // Assert
    assert.ok(response.ok, "successful response");

    assert.ok(json.hasOwnProperty("email"), "email exists");
    assert.equal(json.email, user.email, "expected email");
    assert.strictEqual(
      typeof json.email,
      "string",
      "property email has correct type"
    );

    assert.ok(json.hasOwnProperty("password"), "password exists");
    assert.equal(json.password, user.password, "expected password");
    assert.strictEqual(
      typeof json.password,
      "string",
      "property password has correct type"
    );

    assert.ok(json.hasOwnProperty("accessToken"), "accessToken exists");
    assert.strictEqual(
      typeof json.accessToken,
      "string",
      "property accessToken has correct type"
    );

    assert.ok(json.hasOwnProperty("_createdOn"), "_createdOn exists");
    assert.strictEqual(
      typeof json._createdOn,
      "number",
      "property _createdOn has correct type"
    );

    assert.ok(json.hasOwnProperty("_id"), "_id exists");
    assert.strictEqual(
      typeof json._id,
      "string",
      "property _id has correct type"
    );

    token = json.accessToken;
    userId = json._id;
    sessionStorage.setItem("music-user", JSON.stringify(user));
  });

  QUnit.test("Login", async (assert) => {
    // Arrange
    const path = "/users/login";

    // Act
    let response = await fetch(baseUrl + path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(user),
    });
    let json = await response.json();
    // console.log(json);

    // Assert
    assert.ok(response.ok, "successful response");

    assert.ok(json.hasOwnProperty("email"), "email exists");
    assert.equal(json.email, user.email, "expected email");
    assert.strictEqual(
      typeof json.email,
      "string",
      "property email has correct type"
    );

    assert.ok(json.hasOwnProperty("password"), "password exists");
    assert.equal(json.password, user.password, "expected password");
    assert.strictEqual(
      typeof json.password,
      "string",
      "property password has correct type"
    );

    assert.ok(json.hasOwnProperty("accessToken"), "accessToken exists");
    assert.strictEqual(
      typeof json.accessToken,
      "string",
      "property accessToken has correct type"
    );

    assert.ok(json.hasOwnProperty("_createdOn"), "_createdOn exists");
    assert.strictEqual(
      typeof json._createdOn,
      "number",
      "property _createdOn has correct type"
    );

    assert.ok(json.hasOwnProperty("_id"), "_id exists");
    assert.strictEqual(
      typeof json._id,
      "string",
      "property _id has correct type"
    );

    token = json.accessToken;
    userId = json._id;
    sessionStorage.setItem("music-user", JSON.stringify(user));
  });
});

QUnit.module("Album Functionality", () => {
  QUnit.test("Get All Albums", async (assert) => {
    // Arrange
    const path = "/data/albums";
    const queryParrams = "?sortBy=_createdOn%20desc&distinct=name";

    // Act
    let response = await fetch(baseUrl + path + queryParrams);
    let json = await response.json();
    // console.log(json);

    // Assert
    assert.ok(response.ok, "successful response");
    assert.ok(Array.isArray(json), "the response is array");

    json.forEach((album) => {
      assert.ok(album.hasOwnProperty("artist"), "artist exists");
      assert.strictEqual(
        typeof album.artist,
        "string",
        "property artist has correct type"
      );

      assert.ok(album.hasOwnProperty("description"), "description exists");
      assert.strictEqual(
        typeof album.description,
        "string",
        "property description has correct type"
      );

      assert.ok(album.hasOwnProperty("genre"), "genre exists");
      assert.strictEqual(
        typeof album.genre,
        "string",
        "property genre has correct type"
      );

      assert.ok(album.hasOwnProperty("imgUrl"), "imgUrl exists");
      assert.strictEqual(
        typeof album.imgUrl,
        "string",
        "property imageUrl has correct type"
      );

      assert.ok(album.hasOwnProperty("name"), "name exists");
      assert.strictEqual(
        typeof album.name,
        "string",
        "property name has correct type"
      );

      assert.ok(album.hasOwnProperty("price"), "price exists");
      assert.strictEqual(
        typeof album.price,
        "string",
        "property price has correct type"
      );

      assert.ok(album.hasOwnProperty("releaseDate"), "releaseDate exists");
      assert.strictEqual(
        typeof album.releaseDate,
        "string",
        "property releaseDate has correct type"
      );

      assert.ok(album.hasOwnProperty("_createdOn"), "_createdOn exists");
      assert.strictEqual(
        typeof album._createdOn,
        "number",
        "property _createdOn has correct type"
      );

      assert.ok(album.hasOwnProperty("_id"), "_id exists");
      assert.strictEqual(
        typeof album._id,
        "string",
        "property _id has correct type"
      );

      assert.ok(album.hasOwnProperty("_ownerId"), "_ownerId exists");
      assert.strictEqual(
        typeof album._ownerId,
        "string",
        "property _ownerId has correct type"
      );
    });
  });

  QUnit.test("Create Album", async (assert) => {
    // Arrange
    const path = "/data/albums";
    myAlbum.name = `Random album ${random()}`;
    myAlbum.description = `Description ${random()}`;

    // Act
    let response = await fetch(baseUrl + path, {
      method: "POST",
      headers: { "content-type": "application/json", "X-Authorization": token },
      body: JSON.stringify(myAlbum),
    });

    let album = await response.json();
    // console.log(album);

    // Assert
    assert.ok(response.ok, "successful response");

    assert.ok(album.hasOwnProperty("artist"), "artist exists");
    assert.equal(album.artist, myAlbum.artist, "expected artist");
    assert.strictEqual(
      typeof album.artist,
      "string",
      "property artist has correct type"
    );

    assert.ok(album.hasOwnProperty("description"), "description exists");
    assert.equal(
      album.description,
      myAlbum.description,
      "expected description"
    );
    assert.strictEqual(
      typeof album.description,
      "string",
      "property description has correct type"
    );

    assert.ok(album.hasOwnProperty("genre"), "genre exists");
    assert.equal(album.genre, myAlbum.genre, "expected genre");
    assert.strictEqual(
      typeof album.genre,
      "string",
      "property genre has correct type"
    );

    assert.ok(album.hasOwnProperty("imgUrl"), "imgUrl exists");
    assert.equal(album.imgUrl, myAlbum.imgUrl, "expected imgUrl");
    assert.strictEqual(
      typeof album.imgUrl,
      "string",
      "property imageUrl has correct type"
    );

    assert.ok(album.hasOwnProperty("name"), "name exists");
    assert.equal(album.name, myAlbum.name, "expected name");
    assert.strictEqual(
      typeof album.name,
      "string",
      "property name has correct type"
    );

    assert.ok(album.hasOwnProperty("price"), "price exists");
    assert.equal(album.price, myAlbum.price, "expected price");
    assert.strictEqual(
      typeof album.price,
      "string",
      "property price has correct type"
    );

    assert.ok(album.hasOwnProperty("releaseDate"), "releaseDate exists");
    assert.equal(
      album.releaseDate,
      myAlbum.releaseDate,
      "expected releaseDate"
    );
    assert.strictEqual(
      typeof album.releaseDate,
      "string",
      "property releaseDate has correct type"
    );

    assert.ok(album.hasOwnProperty("_createdOn"), "_createdOn exists");
    assert.strictEqual(
      typeof album._createdOn,
      "number",
      "property _createdOn has correct type"
    );

    assert.ok(album.hasOwnProperty("_id"), "_id exists");
    assert.strictEqual(
      typeof album._id,
      "string",
      "property _id has correct type"
    );

    assert.ok(album.hasOwnProperty("_ownerId"), "_ownerId exists");
    assert.strictEqual(
      typeof album._ownerId,
      "string",
      "property _ownerId has correct type"
    );

    lastCreatedAlbumId = album._id;
  });

  QUnit.test("Edit Album", async (assert) => {
    // Arrange
    const path = "/data/albums";
    const queryParrams = `/${lastCreatedAlbumId}`;

    // Act
    myAlbum.name = `Random edited album ${random()}`;
    let response = await fetch(baseUrl + path + queryParrams, {
      method: "PUT",
      headers: { "content-type": "application/json", "X-Authorization": token },
      body: JSON.stringify(myAlbum),
    });

    let album = await response.json();
    // console.log(album);

    // Assert
    assert.ok(response.ok, "successful response");

    assert.ok(album.hasOwnProperty("artist"), "artist exists");
    assert.equal(album.artist, myAlbum.artist, "expected artist");
    assert.strictEqual(
      typeof album.artist,
      "string",
      "property artist has correct type"
    );

    assert.ok(album.hasOwnProperty("description"), "description exists");
    assert.equal(
      album.description,
      myAlbum.description,
      "expected description"
    );
    assert.strictEqual(
      typeof album.description,
      "string",
      "property description has correct type"
    );

    assert.ok(album.hasOwnProperty("genre"), "genre exists");
    assert.equal(album.genre, myAlbum.genre, "expected genre");
    assert.strictEqual(
      typeof album.genre,
      "string",
      "property genre has correct type"
    );

    assert.ok(album.hasOwnProperty("imgUrl"), "imgUrl exists");
    assert.equal(album.imgUrl, myAlbum.imgUrl, "expected imgUrl");
    assert.strictEqual(
      typeof album.imgUrl,
      "string",
      "property imageUrl has correct type"
    );

    assert.ok(album.hasOwnProperty("name"), "name exists");
    assert.equal(album.name, myAlbum.name, "expected name");
    assert.strictEqual(
      typeof album.name,
      "string",
      "property name has correct type"
    );

    assert.ok(album.hasOwnProperty("price"), "price exists");
    assert.equal(album.price, myAlbum.price, "expected price");
    assert.strictEqual(
      typeof album.price,
      "string",
      "property price has correct type"
    );

    assert.ok(album.hasOwnProperty("releaseDate"), "releaseDate exists");
    assert.equal(
      album.releaseDate,
      myAlbum.releaseDate,
      "expected releaseDate"
    );
    assert.strictEqual(
      typeof album.releaseDate,
      "string",
      "property releaseDate has correct type"
    );

    assert.ok(album.hasOwnProperty("_createdOn"), "_createdOn exists");
    assert.strictEqual(
      typeof album._createdOn,
      "number",
      "property _createdOn has correct type"
    );

    assert.ok(album.hasOwnProperty("_id"), "_id exists");
    assert.strictEqual(
      typeof album._id,
      "string",
      "property _id has correct type"
    );

    assert.ok(album.hasOwnProperty("_ownerId"), "_ownerId exists");
    assert.strictEqual(
      typeof album._ownerId,
      "string",
      "property _ownerId has correct type"
    );
  });

  QUnit.test("Delete Album", async (assert) => {
    // Arrange
    const path = "/data/albums";
    const queryParrams = `/${lastCreatedAlbumId}`;

    // Act
    let response = await fetch(baseUrl + path + queryParrams, {
      method: "DELETE",
      headers: { "X-Authorization": token },
    });
    assert.ok(response.ok, "successful response");
  });
});
