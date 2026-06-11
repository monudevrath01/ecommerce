import React from 'react'

const Flex = () => {
  return (
    <>
    <section className="py-5 my-5">
  <div className="container-fluid">
    <div
      className="bg-warning py-5 rounded-5"
      style={{ backgroundImage: 'url("../src/assets/images/bg-pattern-2.png") no-repeat' }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img
              src="../src/assets/images/phone.png"
              alt="phone"
              className="image-float img-fluid"
            />
          </div>
          <div className="col-md-8">
            <h2 className="my-5">Shop faster with foodmart App</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sagittis
              sed ptibus liberolectus nonet psryroin. Amet sed lorem posuere sit
              iaculis amet, ac urna. Adipiscing fames semper erat ac in
              suspendisse iaculis. Amet blandit tortor praesent ante vitae. A,
              enim pretiummi senectus magna. Sagittis sed ptibus liberolectus
              non et psryroin.
            </p>
            <div className="d-flex gap-2 flex-wrap">
              <img src="../src/assets/images/app-store.jpg" alt="app-store" />
              <img src="../src/assets/images/google-play.jpg" alt="google-play" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </>
  )
}

export default Flex