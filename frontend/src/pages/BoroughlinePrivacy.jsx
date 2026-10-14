import SEO from '../components/SEO'
import './BoroughlinePrivacy.css'

const BoroughlinePrivacy = () => {
  const updatedDate = 'July 13, 2026'

  return (
    <div className="boroughline-privacy-page">
      <SEO
        title="Boroughline Privacy Policy"
        description="Official Boroughline privacy policy for Google Play and Apple App Store listing compliance."
        image="https://www.nothingelsesolutions.com/logo.png"
        url="https://www.nothingelsesolutions.com/boroughline/privacy-policy"
      />

      <main className="boroughline-privacy-wrap">
        <article className="boroughline-privacy-card">
          <span className="boroughline-privacy-pill">Boroughline</span>
          <h1>Privacy Policy</h1>
          <p className="boroughline-privacy-meta">Last updated: {updatedDate}</p>

          <p>
            This Privacy Policy explains how Boroughline handles information when you use the app.
          </p>

          <h2>Data We Collect</h2>
          <p>
            Boroughline is designed to minimize personal data collection. We do not sell personal
            data.
          </p>
          <ul>
            <li>
              <strong>Location (optional):</strong> If you allow location access, the app uses your
              location to show nearby stations and improve route context.
            </li>
            <li>
              <strong>On-device preferences:</strong> Favorites, settings, and saved pathways are
              stored locally on your device.
            </li>
            <li>
              <strong>Transit data:</strong> Train and bus positions, arrivals, and service alerts are
              sourced from public transit feeds.
            </li>
            <li>
              <strong>Diagnostic data:</strong> We may collect limited crash and performance data to
              keep the app reliable.
            </li>
          </ul>

          <h2>How Data Is Used</h2>
          <ul>
            <li>To provide arrivals, trip planning, and map features.</li>
            <li>To remember your in-app preferences on your device.</li>
            <li>To support reliability and debugging of app functionality.</li>
          </ul>

          <h2>Data Sharing</h2>
          <p>
            We do not sell your personal information. Data may be processed by service providers
            required to operate app features, such as mapping and routing services, consistent with
            their own privacy terms.
          </p>

          <h2>Data Retention</h2>
          <p>
            App preferences saved on-device remain until you clear app data, uninstall, or remove
            saved items in the app. Diagnostic data retention depends on service provider retention
            policy.
          </p>

          <h2>Your Choices</h2>
          <ul>
            <li>You can deny or revoke location permission in your device settings.</li>
            <li>You can remove saved locations and preferences in the app.</li>
            <li>You can request data deletion assistance using the contact below.</li>
          </ul>

          <h2>Children's Privacy</h2>
          <p>
            Boroughline is not directed to children under 13, and we do not knowingly collect
            personal information from children.
          </p>

          <h2>Changes To This Policy</h2>
          <p>
            We may update this policy from time to time. Updates are posted at this URL with a
            revised &quot;Last updated&quot; date.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy questions or deletion requests, contact{' '}
            <a href="mailto:customerservice@nothingelsesolutions.com">
              customerservice@nothingelsesolutions.com
            </a>
            .
          </p>
        </article>
      </main>
    </div>
  )
}

export default BoroughlinePrivacy
