function easeIn(a, b, percent) {
    return a + (b - a) * pow(percent, 2);
}
  
function easeOut(a, b, percent) {
    return a + (b - a) * (1 - pow(1 - percent, 2));
}
  
function easeInOut(a, b, percent) {
    return a + (b - a) * ((-cos(percent * PI)/2) + 0.5);
}
  
function percentRemaining(n, total) {
    return (n % total) / total;
}
    
function interpolate(a, b, percent) {
    return a + (b - a) * percent;
}
  
function limitValue(value, mini, maxi) { 
    return max(mini, min(value, maxi));  
}
  
function randomChoice(options) {
    return options[round(random(0, options.length-1))]; 
}