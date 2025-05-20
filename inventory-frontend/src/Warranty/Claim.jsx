
export default function WarrantyPolicy({ setMode }) {
    return (
      <div className="lg:max-w-[80vw] mx-auto p-6 space-y-6">
        <div className="flex justify-center gap-4 mb-6">
           <button
             onClick={() => setMode("register")}
             className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
           >
             Register Warranty
           </button>
           <button
             onClick={() => setMode("claim")}
             className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
           >
             Claim Warranty
           </button>
         </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded">
          <h1 className="text-2xl font-bold mb-1">🛡️ You're Covered!</h1>
          <p>
            Your Mopawa power bank is backed by a <strong>6-month limited warranty</strong>. Here's everything you need to know about staying protected.
          </p>
        </div>
  
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold text-lg mb-2">🔍 Warranty At a Glance</h2>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="font-semibold py-1">📆 Duration:</td>
                <td>6 months from registration</td>
              </tr>
              <tr>
                <td className="font-semibold py-1">📝 Activation:</td>
                <td>Register within 7 days of purchase</td>
              </tr>
              <tr>
                <td className="font-semibold py-1">🛠️ Coverage:</td>
                <td>Free replacement or repair</td>
              </tr>
              <tr>
                <td className="font-semibold py-1">🚫 Excludes:</td>
                <td>Liquid damage, misuse, unauthorized repairs</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        {/* Sections */}
        <section>
          <h2 className="text-lg font-semibold">1. Warranty Period</h2>
          <p>
            The warranty lasts <strong>6 months</strong> starting from the date of successful online registration. If not registered, the period starts from the product’s stock release date.
          </p>
        </section>
  
        <section>
          <h2 className="text-lg font-semibold">2. What’s Covered</h2>
          <p>We will repair or replace your power bank at no cost if it meets warranty conditions. You get either;</p>
          <ul className="list-disc list-inside pl-4">
            <li>🔄 Replacement of the full unit</li>
            <li>🔋 Replacement of battery cells or cables</li>
          </ul>
        </section>
  
        <section>
          <h2 className="text-lg font-semibold">3. After a Repair or Replacement</h2>
          <p>
            Your warranty continues from the original registration date. It won’t reset after a service.
          </p>
        </section>
  
        <section>
          <h2 className="text-lg font-semibold">4. How to Activate</h2>
          <ul className="list-disc list-inside pl-4">
            <li>Register within <strong>7 days</strong> of purchase</li>
            <li>Provide your <strong>phone number</strong> and <strong>product serial number</strong></li>
            <li>You'll receive a confirmation SMS upon successful registration</li>
          </ul>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-2 rounded">
            <p><strong>Tip:</strong> Products not registered will default to the stock release date warranty.</p>
          </div>
        </section>
  
        <section>
          <h2 className="text-lg font-semibold">5. What’s Not Covered</h2>
          <ul className="list-disc list-inside pl-4">
            <li>❌ Damage from misuse, accidents, water, or tampering</li>
            <li>❌ Normal wear and tear (e.g. frayed cables)</li>
            <li>❌ Purchases from unauthorized sellers</li>
            <li>❌ Products with broken warranty seals</li>
          </ul>
        </section>
  
        <section>
          <h2 className="text-lg font-semibold">6. How to Claim</h2>
          <ol className="list-decimal list-inside pl-4">
            <li>📞 Call us at <strong>+254 708 999 666</strong> or visit an authorized dealer</li>
            <li>📦 Bring your product for a quick check</li>
            <li>🔐 Verify with an OTP from your registered number</li>
            <li>✅ Follow the instructions from our support team</li>
          </ol>
        </section>
  
        <section>
          <h2 className="text-lg font-semibold">7. Limitation of Liability</h2>
          <p>
            This warranty is limited to repairs or replacements. It does not cover indirect losses such as data loss or device incompatibility.
          </p>
        </section>
      </div>
    );
  }
  