// Bake-off #2 -- Seleção em Interfaces Densas
// IPM 2023-24, Período 3
// Entrega: até às 23h59, dois dias úteis antes do sexto lab (via Fenix)
// Bake-off: durante os laboratórios da semana de 18 de Março

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER        = 31;      // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE  = true;  // Set to 'true' to record user results to Firebase

const CATEGORY = 1;
const TARGET = 0;

let start_game = false;

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS       = 12;       // The numbers of trials (i.e., target selections) to be completed
const CATEGORY_ROWS = 2;
const CATEGORY_COLUMNS = 5;
let continue_button;
let legendas;                                 // The item list from the "legendas" CSV
let sortedLabels;                           // Contains all data in legendas.csv sorted alphabetically by city name
let MAX_ROW_LENGTH = 5;              // Number of columns of targets inside each category

// Metrics (DO NOT CHANGE!)
let testStartTime, testEndTime;     // time between the start and end of one attempt (8 trials)
let hits 			      = 0;      // number of successful selections
let misses 			      = 0;      // number of missed selections (used to calculate accuracy)
let database;                       // Firebase DB  
let correct_sound;
let wrong_sound;
// Study control parameters (DO NOT CHANGE!)
let draw_targets          = false;  // used to control what to show in draw()
let trials;                         // contains the order of targets that activate in the test
let current_trial         = 0;      // the current trial number (indexes into trials array above)
let attempt               = 0;      // users complete each test twice to account for practice (attemps 0 and 1)

// Target list and layout variables
let targets               = [];
const GRID_ROWS           = 6;      // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS        = 10;     // We divide our 80 targets in a 8x10 grid


// Categories
const categories = [
  "A",
  "D",
  "E",
  "G",
  "H",
  "I",
  "K",
  "L",
  "M",
  "N",
  "O",
  "R",
  "S",
  "T",
  "U",
  "V",
  "Y",
  "Z",
];


// State
let currentCategory = "";

function close_category() {
  currentCategory = "";
}

function open_category(categoryName) {
  currentCategory = categoryName;
}

// Checks whether a given category has its menu opened
function is_open(categoryName) {
  return categoryName == currentCategory;
}


// Ensures important data is loaded before the program starts
function preload(){
  legendas = loadTable('legendas.csv', 'csv', 'header');

  correct_sound = loadSound('/correct.mp3');
  wrong_sound = loadSound('/wrong.mp3.wav');
   
}


function startWarning() {
  
  textFont("Arial", 26);
  textStyle(BOLD);
  fill(color(255, 255, 255));
  textAlign(CENTER);
  //text("Como jogar?", width / 2, 185);
  
  textStyle(NORMAL);
  textFont("Arial", 14);
  fill(color(255, 255, 255));
  text("O nosso protótipo consiste num menu principal com várias categorias. \n  A categoria é ditada pela ÚLTIMA letra do alvo pretendido. \n  Clica no botão para veres um exemplo.", 310, 180);

  //text("2º : Procurar dentro do submenu (ordenado por tamanho de palavra) o alvo pretendido.", 350, 230)

  //text("Nota: Toma um tempo para te familiarizares com a interface. O tempo só começa a contar \n assim que clicares em um dos alvos com o nome de uma cidade. Boa sorte!", 350, 475)
  
  textStyle(BOLD);
  //text("Ex: Buenos Aires", 140,255 )
  
  // 4. Image
  //img = createImg('./screenshot.png', 'Exemplo da organização descrita');
  //img.size(200, 150);
  //img.position(85,290);

  //img2 = createImg('./screenshot2.png', 'Exemplo da organização descrita');
  //img2.size(240, 160);
  //img2.position(385,290);
  

  textFont("Arial",12);
  fill(color(255, 255, 255));
  //text("Menu Principal (letra S)", 175, 285);

  textFont("Arial",12);
  fill(color(255, 255, 255));
  //text("Submenu S (Buenos Aires)", 505, 285);
  
}

// Runs once at the start
function setup()
{

  const cities = legendas.getColumn("city");
  
  let sortedLabels = cities.map(city => city.split('').reverse().join(''));

  // Sort the reversed column
  sortedLabels.sort();

  labels = {};

  for(const category of categories){
    
    labels[category] = [];  // initializes an empty array for each category
    
    for(const label of sortedLabels){
      
      normal_label = label.split('').reverse().join('')
      if(label[0].toUpperCase() === category || label[0] == 'é' && category == "E" || label[0] == 'á' && category == "A"   ){   // pushes label into category if first two characters match
        labels[category].push(normal_label);    
      } 
    }
    labels[category].sort((a, b) => a.length - b.length); //sorts by length
    //labels[category].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));  //Sorts alphabetically
  }

  close_category();


  createCanvas(700, 500);    // window size in px before we go into fullScreen()
  frameRate(60);             // frame rate (DO NOT CHANGE!)
  
  randomizeTrials();         // randomize the trial order at the start of execution
  drawUserIDScreen();        // draws the user start-up screen (student ID and display size)
  startWarning();
}

// Runs every frame and redraws the screen
function draw()
{
  if (draw_targets && attempt < 2)
  {     
    // The user is interacting with the 6x3 target grid
    background(color(0, 0, 0));        // sets background to black
    
    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255,255,255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);


    // Draw all category targets, traversing the target object
    if (currentCategory != "") {
      targets[currentCategory].backArrow.draw();
      for (const target in targets[currentCategory].children) {
        targets[currentCategory].children[target].draw();
      }
    } else {
      for (const category in targets) {
        targets[category].categoryTarget.draw();
      }
    }
          
    // Draws the target label to be selected in the current trial. We include 
    // a black rectangle behind the trial label for optimal contrast in case 
    // you change the background colour of the sketch (DO NOT CHANGE THESE!)
    fill(color(0,0,0));
    rect(0, height - 40, width, 40);
 
    textFont("Arial", 20); 
    fill(color(255,255,255)); 
    textAlign(CENTER); 
    text(legendas.getString(trials[current_trial],1), width/2, height - 20);
  }
}

// Print and save results at the end of 54 trials
function printAndSavePerformance()
{
  // DO NOT CHANGE THESE! 
  let accuracy			= parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time         = (testEndTime - testStartTime) / 1000;
  let time_per_target   = nf((test_time) / parseFloat(hits + misses), 0, 3);
  let penalty           = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
  let target_w_penalty	= nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
  let timestamp         = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();
  
  textFont("Arial", 18);
  background(color(0,0,0));   // clears screen
  fill(color(255,255,255));   // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20);    // display time on screen (top-left corner)
  
  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width/2, 60); 
  text("Hits: " + hits, width/2, 100);
  text("Misses: " + misses, width/2, 120);
  text("Accuracy: " + accuracy + "%", width/2, 140);
  text("Total time taken: " + test_time + "s", width/2, 160);
  text("Average time per target: " + time_per_target + "s", width/2, 180);
  text("Average time for each target (+ penalty): " + target_w_penalty + "s", width/2, 220);

  // Saves results (DO NOT CHANGE!)
  let attempt_data = 
  {
        project_from:       GROUP_NUMBER,
        assessed_by:        student_ID,
        test_completed_by:  timestamp,
        attempt:            attempt,
        hits:               hits,
        misses:             misses,
        accuracy:           accuracy,
        attempt_duration:   test_time,
        time_per_target:    time_per_target,
        target_w_penalty:   target_w_penalty,
  }
  
  // Sends data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE)
  {
    // Access the Firebase DB
    if (attempt === 0)
    {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }
    
    // Adds user performance results
    let db_ref = database.ref('G' + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }
}

function mouseMoved() {
  // Check if the mouse is hovering over any of the targets
  
  if(currentCategory != ""){
    
    for(const target in targets[currentCategory].children){
      targets[currentCategory].children[target].hover(mouseX, mouseY);
    }
    
    targets[currentCategory].backArrow.hover(mouseX,mouseY);
    
  } else{
    
    for(const category in targets){
      targets[category].categoryTarget.hover(mouseX,mouseY);
    }
  }

}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() {
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets) {

    // If we are inside one of the categories
    if(currentCategory != "") {

      // If the user clicks the back arrow button we close the category
      if (targets[currentCategory].backArrow.clicked(mouseX, mouseY)) {
        close_category();
      } else {
        // Iterates over the targets inside the category
       for (const target of Object.values(targets[currentCategory].children)) {

          if (target.clicked(mouseX, mouseY)) {

            // Checks if clicked target matches the expected target in the current trial
            if ((legendas.findRow(target.label, "city").getNum("id") - 1) === trials[current_trial]) {
              
              hits++;
              if(correct_sound.isLoaded()){
                correct_sound.play();
              }

             
            } else {
              misses++;
              if(wrong_sound.isLoaded()){
                wrong_sound.play();
              }
            }
            
            print("User must find:");
            let row = legendas.getRow(trials[current_trial]);
            print(row.getString("city"));
            print("User clicked on:");
            print(target);
            
            current_trial++;
            close_category();
            break;

          }
        }
      }
    } else{   // If we aren't inside a category (we are in the menu with all categories)

      for(const category in targets){
        if(targets[category].categoryTarget.clicked(mouseX,mouseY)){
          open_category(category);
          break;
        }
      }
    }

    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS) {
      testEndTime = millis();
      draw_targets = false;          // Stop showing targets and the user performance results
      printAndSavePerformance();     // Print the user's results on-screen and send these to the DB
      attempt++;                      
      
      // If there's an attempt to go create a button to start this
      if (attempt < 2) {
        continue_button = createButton('START 2ND ATTEMPT');
        continue_button.mouseReleased(continueTest);
        continue_button.position(width/2 - continue_button.size().width/2, height/2 - continue_button.size().height/2);
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) testStartTime = millis(); 
  }
}

// Evoked after the user starts its second (and last) attempt
function continueTest() {

  close_category();

  // Re-randomize the trial order
  randomizeTrials();
  
  // Resets performance variables
  hits = 0;
  misses = 0;
  
  current_trial = 0;
  continue_button.remove();
  
  // Shows the targets again
  draw_targets = true; 
}

// Creates and positions the UI targets
function createTargets(target_size, horizontal_gap, vertical_gap) {
  // Define the margins between targets by dividing the white space 
  // for the number of targets minus one
  h_margin = horizontal_gap / (GRID_COLUMNS -1);
  v_margin = vertical_gap / (GRID_ROWS - 1);

  let c = 3;
  let r = 1;

  for(const category of categories){

    const category_label = category;
    const arrowLabel = "<";

    const target_x = 40 + (h_margin + target_size) * c + target_size / 2;
    const target_y = 40 + (v_margin + target_size) * r + target_size / 2;

    // Children (targets inside each category)
    const rowLength = min(MAX_ROW_LENGTH, labels[category].length);
    let rChild = r+1;
    let initialC = c - floor(rowLength / 2);

    while (initialC + rowLength > GRID_COLUMNS + 1){
      initialC--;
    }

    let cChild = initialC;
    const children = {};

    // Formats the drawing of the child targets of the category
    for(const label of labels[category]){
      let target_x = 40 + (h_margin + target_size) * cChild + target_size/2;        // give it some margin from the left border
      let target_y = (v_margin + target_size) * rChild + target_size/2;

      // The target
      const target = new Target(target_x, target_y, target_size, label, legendas.findRow(label, "city").getNum("id"), TARGET);
      children[label] = target;

      cChild ++;

      if (cChild > c + rowLength / 2) {
        cChild = initialC;
        rChild++;
      }
    }

    // The category
    const categoryTarget = new Target(target_x, target_y, 1.4*target_size, category_label, null, CATEGORY);

    const backArrow = new Target(target_x, target_y, target_size, arrowLabel, null, CATEGORY);

    targets[category] = {
      categoryTarget: categoryTarget,
      backArrow: backArrow,
      children: children,
    };

    c++;
    if (c > CATEGORY_COLUMNS + 2) {
      c = 3;
      r++;
    }
  }
}





// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() {

  if (fullscreen() && start_game === true) {

    resizeCanvas(windowWidth, windowHeight);
    
    // DO NOT CHANGE THE NEXT THREE LINES!
    let display        = new Display({ diagonal: display_size }, window.screen);
    PPI                = display.ppi;                      // calculates pixels per inch
    PPCM               = PPI / 2.54;                       // calculates pixels per cm
  
    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width   = display.width * 2.54;             // screen width
    let screen_height  = display.height * 2.54;            // screen height
    let target_size    = 2;                                // sets the target size (will be converted to cm when passed to createTargets)
    let horizontal_gap = screen_width - target_size * GRID_COLUMNS;// empty space in cm across the x-axis (based on 10 targets per row)
    let vertical_gap   = screen_height - target_size * GRID_ROWS;  // empty space in cm across the y-axis (based on 8 targets per column)

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    createTargets(target_size * PPCM, horizontal_gap * PPCM - 80, vertical_gap * PPCM - 80);

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}