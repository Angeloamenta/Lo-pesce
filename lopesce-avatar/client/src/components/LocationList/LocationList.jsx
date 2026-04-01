import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import locationsData from '../../data/locations.json';
import './LocationList.css';

export default function LocationList() {
  return (
    <div className="location-list-container">
      <div className="location-header">
        <h2>Le Nostre Sedi</h2>
      </div>

      <div className="location-grid">
        {locationsData.map((loc) => (
          <div key={loc.id} className="location-card">
            <div className="location-city-header">
              <h3>{loc.citta}</h3>
            </div>

            <div className="location-details">
              <div className="loc-item">
                <MapPin size={18} className="loc-icon" />
                <span>{loc.indirizzo}</span>
              </div>
              <div className="loc-item">
                <Phone size={18} className="loc-icon" />
                <span>{loc.telefono}</span>
              </div>
              <div className="loc-item">
                <Mail size={18} className="loc-icon" />
                <span>{loc.email}</span>
              </div>
              <div className="loc-item">
                <Clock size={18} className="loc-icon" />
                <span>{loc.orari}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
