import React from 'react'
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      <div className="container mt-5">
        <div className="card">
          <img src="https://firebasestorage.googleapis.com/v0/b/comlab-a2157.appspot.com/o/86638845_238566497142183_14158544374857728_n.jpg?alt=media&token=ed88e484-ab0b-4c0c-941f-586205f28230" className='card-img-top' alt="..." />
          <div className="card-body">
            <h5 className="card-title">Developer information</h5>
            <p>Pongpisut Khumjui 610610599</p>
            <Link to="/">
              <h3>
                <button type="button" className="btn btn-primary">Home</button>
              </h3>
            </Link>
          </div>

        </div>
        
      </div>
      
    </div>
  )
}

