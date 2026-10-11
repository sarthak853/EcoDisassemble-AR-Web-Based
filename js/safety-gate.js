export class SafetyGate {
  evaluate(symptomsText, aiResults, hazardsChecked) {
    let flag = 'SAFE';
    let message = 'Proceed to AR steps.';
    
    const dangerousHazards = ['swelling', 'burning', 'sparks', 'hot', 'smoke', 'high voltage'];
    const textLower = symptomsText.toLowerCase();
    
    // Evaluate User Input
    const userHazard = hazardsChecked.some(h => dangerousHazards.includes(h)) || 
                       dangerousHazards.some(h => textLower.includes(h));
                       
    // Evaluate Edge-AI Results
    const aiHazard = aiResults.some(res => 
      ['swollen_battery', 'shattered_screen', 'exposed_wire'].includes(res.class) && res.confidence > 0.85
    );
    
    // Deterministic Rule Engine
    if (userHazard || aiHazard) {
      flag = 'HAZARD_STOP';
      message = 'STOP: TECHNICIAN REQUIRED. Severe hazard detected.';
    } else if (hazardsChecked.includes('liquid') || textLower.includes('water')) {
      flag = 'WARNING';
      message = 'WARNING: Liquid damage. Proceed with caution and ensure power is disconnected.';
    }
    
    return { flag, message };
  }
}
