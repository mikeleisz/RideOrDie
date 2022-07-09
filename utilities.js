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

function overlap(x1, w1, x2, w2, percent) {
    var half = (percent || 1)/2;
    var min1 = x1 - (w1*half);
    var max1 = x1 + (w1*half);
    var min2 = x2 - (w2*half);
    var max2 = x2 + (w2*half);
    return ! ((max1 < min2) || (min1 > max2));
}