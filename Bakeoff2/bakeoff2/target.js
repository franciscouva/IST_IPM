
// Target class (position and width)
class Target{
  constructor(x, y, w, l, id, type)
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.label  = l;
    this.id     = id;
    this.type   = type;
    this.color  =  this.type == CATEGORY ? getColor(l.charAt(0).toUpperCase()) : getTargetColor(this.label);
    this.hovered = false;
    this.labelSize = l.length;
  }

  
  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y){
    return dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
  }

  hover(mouse_x, mouse_y) {
    this.hovered = dist(this.x, this.y, mouse_x, mouse_y) < this.width / 2;
  }
  
  // Draws the target (i.e., a circle)
  // and its label
  draw() {
    // Set the target size based on hover state
    let targetSize = this.hovered ? this.width * 1.2 : this.width;
    let fontSize = this.hovered ? 24 : 16;
    
    // Change fill color based on hover state
    if (this.hovered) {
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 200); // Semi-transparent color
      
    } else {
      fill(this.color);
    }

  
    textStyle(NORMAL); // Reset the text style
    
    if(this.type == CATEGORY){
      
      // Draw the circle with the adjusted size
      circle(this.x, this.y, targetSize);
      // Draw label
      textFont("Arial", fontSize*2);
      textStyle(BOLD);
      fill(color(255)); // Label color set to white
      textAlign(CENTER);
      text(this.label, this.x, this.y);
    } else{
     
      circle(this.x, this.y, targetSize);
      textFont("Arial", fontSize);
      textStyle(BOLD);
      fill(color(255)); // Label color set to white
      textAlign(CENTER, CENTER); // Align text to the center of the rectangle
      text(this.label, this.x, this.y );

    }
  }
}

function getColor(letter){
  
  switch(letter){
    case 'A':
      return color(56, 27, 27);
    case 'D':
      return color(173, 36, 21);
    case 'E':
      return color(173, 87, 16);
    case 'G':
      return color(173, 123, 16);
    case 'H':
      return color(140, 140, 13);
    case 'I':
      return color(39, 43, 7);
    case 'K':
      return color(94, 138, 19);
    case 'L':
      return color(18, 122, 16);
    case 'M':
      return color(14, 117, 81);
    case 'N':
      return color(14, 117, 115);
    case 'O':
      return color(11, 69, 94);
    case 'R':
      return color(11, 47, 94);
    case 'S':
      return color(11, 25, 94);
    case 'T':
      return color(43, 29, 130);
    case 'U':
      return color(74, 29, 130);
    case 'V':
      return color(100, 29, 130);
    case 'Y':
      return color(127, 29, 130);
    case 'Z':
      return color(125, 54, 54);

    default:
      return color(54, 52, 52);
  }   
}



function getTargetColor(label){
  
  let reversedLabel = label.split('').reverse().join('');

  switch(reversedLabel[0]){
    case 'a':
      return color(56, 27, 27);
    case 'á':
      return color(56, 27, 27);
    case 'd':
      return color(173, 36, 21);
    case 'e':
      return color(173, 87, 16);
    case 'é':
      return color(173, 87, 16);
    case 'g':
      return color(173, 123, 16);
    case 'h':
      return color(140, 140, 13);
    case 'i':
      return color(39, 43, 7);
    case 'k':
      return color(94, 138, 19);
    case 'l':
      return color(18, 122, 16);
    case 'm':
      return color(14, 117, 81);
    case 'n':
      return color(14, 117, 115);
    case 'o':
      return color(11, 69, 94);
    case 'r':
      return color(11, 47, 94);
    case 's':
      return color(11, 25, 94);
    case 't':
      return color(43, 29, 130);
    case 'u':
      return color(74, 29, 130);
    case 'v':
      return color(100, 29, 130);
    case 'y':
      return color(127, 29, 130);
    case 'z':
      return color(125, 54, 54);

    default:
      return color(54, 52, 52);
  }   
}

