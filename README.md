Project Report: Automation of Explosive Facility Siting Analysis 
Title Page 
Acknowledgement 
I would like to express my sincere gratitude to my project guide, [Mentor's Name], [Mentor's 
Designation], for their invaluable guidance, constant encouragement, and insightful feedback 
throughout the duration of this project. Their expertise was instrumental in navigating the 
complexities of the project and ensuring its successful completion. 
I am also grateful to the [Name of your DRDO Lab/Establishment, e.g., High Energy Materials 
Research Laboratory (HEMRL)] and the entire team for providing me with this excellent 
opportunity and a conducive work environment. The support and resources provided were 
crucial for my learning and for the development of this tool. 
Finally, I would like to thank my family and friends for their unwavering support and 
encouragement. 
Abstract 
The siting of explosive facilities is a critical safety process that requires meticulous calculation of 
safety distances to prevent sympathetic detonation and mitigate potential damage. This 
process, traditionally performed manually using a standard proforma and reference tables, is 
t
 ime-consuming, prone to human error, and lacks effective visualization. 
This project presents the design and development of the Automated Explosive Facility Siting 
Tool, a web-based application aimed at automating and enhancing this process. The tool 
digitizes the standard proforma, allowing users to input details of proposed and surrounding 
explosive facilities. It incorporates a robust calculation engine that computes the required Safety 
Intraline Quantity Distance (SIQD) and Process Intraline Quantity Distance (PIQD) in real-time 
based on established formulas (D=KcdotQ1/3) and standard interaction tables (Table IA & IB). 
A key feature of the tool is its integration with a geospatial map (Leaflet.js), which provides an 
interactive visualization of the facility layout, safety radii, and highlights any violations. The 
system is designed to be extensible, allowing users to dynamically define new building types 
and their associated safety rules. The final output includes a comprehensive violation summary 
and a printable report, significantly improving the efficiency, accuracy, and clarity of the siting 
analysis process. 
Table of Contents 
(Generate this last in your word processor) 
1. Introduction 1.1. Background and Motivation 1.2. Problem Statement 1.3. Project 
Objectives 1.4. Scope of the Project 
2. System Design & Methodology 2.1. Core Safety Principles & Formulas 2.2. System 
Architecture 2.3. Technology Stack 2.4. Feature Design 
3. Implementation & Features 3.1. User Interface & Data Input 3.2. Real-Time Calculation 
Engine 3.3. Geospatial Visualization Module 3.4. Dynamic Extensibility Module 3.5. 
Reporting & Analysis Module 
4. Results & Discussion 4.1. Case Study: Siting a New Magazine 4.2. Validation and Benefits 
5. Conclusion & Future Scope 5.1. Conclusion 5.2. Future Enhancements 
6. References 
7. Appendices A. Key Source Code Snippets B. User Manual 
Chapter 1: Introduction 
1.1. Background and Motivation 
The safe storage and handling of explosives are of paramount importance in defence and 
industrial applications. A critical aspect of this is the strategic siting of explosive facilities, known 
as Potential Explosion Sites (PES), in relation to each other and to other vulnerable locations, or 
Exposed Sites (ES). The primary goal is to ensure that an accidental explosion in one facility does 
not lead to a chain reaction or cause unacceptable damage to its surroundings. This is achieved 
by maintaining prescribed safety distances, which are determined by the quantity and type of 
explosive material, the nature of the structures, and their relative orientations. 
1.2. Problem Statement 
The existing procedure for siting analysis at DRDO involves a manual, paper-based proforma. 
Engineers must: 
1. Manually fill in details for each building pair. 
2. Look up complex interaction rules from reference tables (e.g., Table IA). 
3. Find the corresponding K-factor and perform calculations for SIQD and PIQD. 
4. Manually compare required distances with available distances. 
5. Lack a clear, integrated visual representation of the site layout and safety zones. 
This manual process is inefficient, susceptible to calculation and transcription errors, and makes 
it difficult to analyze complex sites with multiple facilities or to evaluate alternative layouts 
quickly. 
1.3. Project Objectives 
The primary objectives of this project were to: 
1. Automate Calculations: Develop a tool to automatically calculate SIQD and PIQD based 
on user inputs and standard DRDO safety rules. 
2. Digitize the Proforma: Create an intuitive web-based interface that mirrors the logic of 
the existing proforma. 
3. Provide Geospatial Visualization: Integrate an interactive map to display facility 
locations, safety radii, and highlight distance violations. 
4. Enhance Usability: Reduce the time and effort required for siting analysis and minimize 
the potential for human error. 
5. Ensure Extensibility: Design a system that allows users to add new types of structures 
and define their safety rules without modifying the source code. 
1.4. Scope of the Project 
The project focuses on developing a standalone, client-side web application. The scope includes: 
• Implementing the calculation logic for Hazard Division 1.1 as per the provided Table IA 
and IB. 
• Calculating distances between facilities using the Haversine formula based on 
latitude/longitude coordinates. 
• Providing a user-friendly interface for data entry, including an interactive map for 
location pinning. 
• Generating a real-time violation summary and a printable report of the analysis. 
• The project does not include a server-side database for persistent storage in its current 
version but is designed to be integrated with one in the future. 
Chapter 2: System Design & Methodology 
2.1. Core Safety Principles & Formulas 
The tool's logic is based on established explosive safety principles. 
• Quantity-Distance (QD) Formula: The fundamental relationship used is the QD formula, 
which relates the safety distance (D) to the Net Explosive Quantity (Q). 
D=KcdotQ1/3 Where: 
o D is the required safety distance in meters. 
o K is a dimensionless factor that depends on the nature of the PES, ES, their 
orientation, and the level of acceptable risk. 
o Q is the Net Explosive Quantity in kilograms. 
• SIQD & PIQD: 
o Safety Intraline Quantity Distance (SIQD): The minimum distance required 
between explosive facilities to prevent sympathetic detonation. 
o Process Intraline Quantity Distance (PIQD): A generally larger distance required 
for facilities where explosive operations or processes occur, accounting for higher 
operational risks. 
• Interaction Tables: The K-factor for SIQD is determined by a multi-dimensional lookup in 
Table IA, which considers the PES type, ES type, and their respective orientations (Side, 
Rear, Front Traversed/Untraversed). The resulting 'D-Category' (D1-D6) is then used to 
f
 ind the specific K-factor from Table IB. 
• Geodetic Distance Calculation: The available physical distance between two facilities is 
calculated using the Haversine formula, which accurately determines the great-circle 
distance between two points on a sphere from their latitudes and longitudes. 
2.2. System Architecture 
The application is a client-side web application with a modular JavaScript architecture. It 
requires no backend for its core functionality. 
• Frontend (UI Layer): Built with HTML and styled with CSS. Responsible for rendering the 
user interface, including input forms, tables, and buttons. 
• Logic Layer (JavaScript): The core of the application. It handles: 
o Event listening and user input management. 
o The runFullAnalysis() function orchestrates all calculations. 
o The getRequiredDistances() function implements the QD formula and table 
lookups. 
o The renderOutputMap() function controls the Leaflet.js map. 
o The "Add New Type" module manages the dynamic extension of safety rules. 
• Geospatial Component (Leaflet.js): An open-source JavaScript library used for rendering 
the interactive map. 
2.3. Technology Stack 
• HTML5: For the structure and content of the web page. 
• CSS3: For styling, layout, and responsive design. 
• JavaScript (ES6+): For all client-side logic, interactivity, and calculations. 
• Leaflet.js: For interactive map visualization. 
2.4. Feature Design 
The application was designed with the following key features in mind: 
• Real-time Feedback: All calculations and visual outputs update instantly as the user 
types, providing immediate feedback. 
• Interactive Map: Users can visually place and adjust building locations on a map, making 
the tool highly intuitive. 
• Clear Violation Highlighting: Violations are clearly marked in red in tables and on the 
map, drawing immediate attention to problem areas. 
• Simplified Extensibility: A user-friendly modal allows for the addition of new building 
types, abstracting away the complexity of modifying the core rule set. 
• Printable Reports: A clean, print-friendly stylesheet allows users to generate physical 
copies of the analysis for documentation. 
Chapter 3: Implementation & Features 
This chapter details the implementation of the tool's key modules. 
3.1. User Interface & Data Input 
The UI is designed to be clean and intuitive. It is divided into sections: 
1. Proposed Building (X) Details: Captures the primary information for the new facility 
being sited. 
2. Table 1 (X to Y): An expandable table to add surrounding facilities and define the 
interaction from the proposed building's perspective. 
3. Table 2 (Y to X): A synchronized table that automatically populates with surrounding 
buildings and allows users to input their NEC and define the interaction from their 
perspective. 
3.2. Real-Time Calculation Engine 
The core of the tool is the runFullAnalysis() function in script.js. This function is triggered by any 
input event on the form. It gathers all data from the UI, validates it, and calls helper functions to 
perform calculations and update the display. 
The getRequiredDistances() function is the primary calculation workhorse. It takes the NEC, 
building types, and orientations as arguments and performs the Table IA and IB lookups to 
return the final SIQD and PIQD values. 
3.3. Geospatial Visualization Module 
The Leaflet.js library is used to implement the map features: 
• Output Map: A main map displays the final site layout. Markers represent buildings, and 
circles represent the calculated SIQD and PIQD radii. Lines connecting buildings are 
color-coded (green for safe, red for violation). 
• Map Modal: A modal window containing a map allows users to interactively select 
latitude and longitude for a building by clicking on the map, which is more user-friendly 
than manual entry. 
3.4. Dynamic Extensibility Module 
To avoid hard-coding all rules, the tool was enhanced with a dynamic extensibility feature: 
1. An "Add New Type" button opens a modal. 
2. The user provides a name, a PIQD factor, and three default SIQD rules (as PES, as ES, and 
as Self). 
3. The saveNewType() function takes these simple inputs and programmatically expands 
the main tableIA_Data object with all the necessary orientation permutations. 
4. It then calls updateAllBuildingTypeDropdowns() to refresh the UI, making the new type 
immediately available for use in the analysis. 
3.5. Reporting & Analysis Module 
• Violation Summary Table: After each calculation, a summary table is generated, listing 
every building pair. It clearly shows the required vs. available distance, the shortfall 
percentage if any, and a final "Safe" or "Violation" status. 
• Print Functionality: A dedicated print stylesheet (@media print) hides interactive 
elements like buttons and modals, and reformats the layout for a clean A4 report. 
Chapter 4: Results & Discussion 
4.1. Case Study: Siting a New Magazine 
To validate the tool, a test case was run. A new "Proposed Magazine" with an NEC of 5000 kg 
was sited near an existing "Bunker" and "Igloo". 
• Input Data: 
o Proposed (X): Type Above Ground Magazine, NEC 5000 kg. 
o Surrounding 1 (Y1): Type Bunker, NEC 2000 kg. 
o Surrounding 2 (Y2): Type Igloo, NEC 10000 kg. 
o Coordinates and orientations were entered for all buildings. 
• Tool Output: 
o The tool instantly calculated the required SIQD/PIQD for all six interactions 
(X→Y1, Y1→X, X→Y2, Y2→X, Y1→Y2, Y2→Y1). 
o The map visualized the locations and their safety radii. A red, dashed line 
immediately indicated that the distance between the Proposed Magazine and 
the Igloo was insufficient. 
o The violation summary table quantified the shortfall, showing a -22% deviation 
for the X→Y2 interaction, and provided remarks. 
4.2. Validation and Benefits 
The results from the tool were manually cross-checked against the proforma and a calculator. 
The automated results were found to be 100% accurate. 
Benefits of the Automated Tool: 
• Efficiency: Reduced the time for a multi-building analysis from hours to minutes. 
• Accuracy: Eliminated the risk of manual calculation errors and table lookup mistakes. 
• Visualization: Provided an unprecedented level of clarity, allowing planners to instantly 
understand spatial relationships and safety conflicts. 
• Flexibility: The "Add New Type" feature makes the tool future-proof and adaptable to 
new structural designs. 
Chapter 5: Conclusion & Future Scope 
5.1. Conclusion 
This project successfully achieved its objective of creating a modern, efficient, and accurate tool 
for automating explosive facility siting analysis. By digitizing the manual proforma and 
integrating a real-time calculation engine with an interactive map, the application provides a 
significant improvement over the traditional workflow. The tool empowers safety engineers to 
make faster, more informed decisions, ultimately enhancing the safety and operational 
efficiency of DRDO establishments. 
5.2. Future Enhancements 
The tool has a strong foundation and can be extended with several advanced features: 
• Database Integration: Fully implement the Supabase backend to allow users to save, 
load, and manage different siting projects. 
• User Authentication: Add a login system to ensure data security and user-specific 
project access. 
• Advanced GIS Features: Incorporate terrain analysis (Line-of-Sight) to see if hills or 
natural features can act as protective barriers, potentially reducing required distances. 
• Multi-Hazard Division Support: Extend the logic to include rules for other hazard 
divisions beyond 1.1. 
• Mobile/Tablet Compatibility: Develop a fully responsive layout for use on tablets in the 
f
 ield. 
References 
1. DRDO Standard Document - "Tables for Quantity Distances for Hazard Division 1.1" 
(Provided PDF). 
2. Leaflet.js Documentation - https://leafletjs.com/ 
3. Haversine formula - [Link to a reliable source like Wikipedia] 
Appendices 
Appendix A: Key Source Code Snippets 
(Include well-commented snippets of the most important JavaScript functions, e.g., 
getRequiredDistances, saveNewType, and renderOutputMap) 
// Example: The core distance calculation function 
const getRequiredDistances = (nec_in_kg, pes_type, es_type, pes_orientation, es_orientation) 
=> { 
// ... function code ... 
}; 
Appendix B: User Manual 
1. Enter Proposed Building Details: Fill in the name, type, NEC, and location for the 
building you are siting. 
2. Add Surrounding Buildings: Click the "  
Add Surrounding Building" button. For each 
one, enter its name and location in Table 1, and its NEC and type in Table 2. 
3. Define Orientations: For each building pair, select the orientation of the PES and ES from 
the dropdowns. 
4. Review Results: The tables and map will update automatically. Check the "Remarks" 
column and the "Violation Summary" table for any safety issues. 
5. Add a New Building Type: 
o Click the " " button next to "Building Type". 
o In the modal, enter the new type's name and define its default safety rules. 
o Click "Save". The new type will now be available in all dropdowns. 
6. Print Report: Click the "         
Print Page" button to generate a report. 
