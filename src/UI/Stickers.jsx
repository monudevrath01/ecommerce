import React from 'react'

const Stickers = () => {
  return (
    <>
    <section className="py-5">
  <div className="container-fluid">
    <div
      className="bg-secondary py-5 my-5 rounded-5"
      style={{
        background: 'url("../src/assets/images/bg-leaves-img-pattern.png") no-repeat'
      }}
    >
      <div className="container my-5">
        <div className="row">
          <div className="col-md-6 p-5">
            <div className="section-header">
              <h2 className="section-title display-4">
                Get <span className="text-primary">25% Discount</span> on your
                first purchase
              </h2>
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dictumst
              amet, metus, sit massa posuere maecenas. At tellus ut nunc amet
              vel egestas.
            </p>
          </div>
          <div className="col-md-6 p-5">
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="name"
                  id="name"
                  placeholder="Name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  name="email"
                  id="email"
                  placeholder="abc@mail.com"
                />
              </div>
              <div className="form-check form-check-inline mb-3">
                <label className="form-check-label" htmlFor="subscribe">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="subscribe"
                    defaultValue="subscribe"
                  />
                  Subscribe to the newsletter
                </label>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-dark btn-lg">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </>
  )
}

export default Stickers