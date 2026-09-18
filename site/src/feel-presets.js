const rows = (value = {}) => ({1:value[1]||{},2:value[2]||{},3:value[3]||{},4:value[4]||{},5:value[5]||{},6:value[6]||{},7:value[7]||{}})

export const FEEL_PRESETS = {
  dreamy: {
    label:'Dreamy', description:'Open, colorful harmony with soft cadences and suspended motion.',
    dimensions:{brightness:65,tension:20,resolution:25,complexity:65,adventure:45,openness:90},
    degreeWeights:{1:1,2:.55,3:.85,4:.95,5:.35,6:.9,7:.1},
    colors:{triad:.45,maj7:.95,min7:.8,add9:1,maj9:.85,min9:.75,sus2:.9,sus4:.35,dominant7:.12,diminished:.08},
    borrowed:{iv:.75,bVII:.55,bVI:.35,bII:.12,III:.35},
    transitions:rows({1:{3:1.25,4:1.35,6:1.3},2:{4:1.25,6:1.2,1:1.1},3:{6:1.35,4:1.3,2:1.05},4:{1:1.2,3:1.25,6:1.25},5:{6:1.35,4:1.25,1:.85},6:{4:1.35,3:1.2,1:1.1},7:{3:1.1,1:.9}}),
    voiceLeading:.9, cadence:.25
  },
  melancholic: {
    label:'Melancholic', description:'Minor-leaning movement, descending color, and bittersweet borrowed harmony.',
    dimensions:{brightness:30,tension:35,resolution:45,complexity:55,adventure:40,openness:65},
    degreeWeights:{1:1,2:.55,3:.75,4:.95,5:.55,6:1,7:.45},
    colors:{triad:.65,maj7:.8,min7:.9,add9:.65,maj9:.45,min9:.6,sus2:.4,sus4:.25,dominant7:.4,diminished:.28},
    borrowed:{iv:1,bVII:.55,bVI:.7,bII:.15,III:.3},
    transitions:rows({1:{6:1.35,4:1.25,3:1.1},2:{5:1.15,4:1.15},3:{6:1.25,4:1.2},4:{1:1.15,6:1.2,5:1.05},5:{1:1.2,6:1.15},6:{4:1.3,1:1.15,3:1.05},7:{1:1.2,3:1.05}}),
    voiceLeading:.75, cadence:.45
  },
  dark: {
    label:'Dark', description:'Low-brightness harmony, modal mixture, and heavier chromatic pull.',
    dimensions:{brightness:15,tension:60,resolution:45,complexity:50,adventure:65,openness:35},
    degreeWeights:{1:1,2:.55,3:.65,4:.9,5:.9,6:1,7:.75},
    colors:{triad:.9,maj7:.4,min7:.55,add9:.35,maj9:.15,min9:.35,sus2:.2,sus4:.35,dominant7:.8,diminished:.75},
    borrowed:{iv:.8,bVII:.95,bVI:1,bII:.75,III:.65},
    transitions:rows({1:{6:1.35,4:1.25,7:1.2,2:1.05},2:{1:1.15,5:1.2,6:1.1},3:{6:1.25,4:1.15},4:{1:1.25,6:1.2,5:1.15},5:{1:1.4,6:1.1},6:{4:1.3,7:1.25,1:1.15},7:{1:1.35,6:1.2}}),
    voiceLeading:.5, cadence:.5
  },
  hopeful: {
    label:'Hopeful', description:'Bright major movement, clear arrivals, and uplifting suspended color.',
    dimensions:{brightness:85,tension:20,resolution:75,complexity:35,adventure:20,openness:60},
    degreeWeights:{1:1,2:.45,3:.4,4:.95,5:.85,6:.7,7:.1},
    colors:{triad:1,maj7:.45,min7:.45,add9:.75,maj9:.25,min9:.2,sus2:.65,sus4:.8,dominant7:.35,diminished:.05},
    borrowed:{iv:.2,bVII:.25,bVI:.08,bII:.02,III:.2},
    transitions:rows({1:{4:1.4,6:1.2,5:1.15},2:{5:1.4,4:1.05},3:{4:1.2,6:1.2},4:{5:1.3,1:1.25},5:{1:1.55,6:1.05},6:{4:1.3,2:1.05},7:{1:1.45}}),
    voiceLeading:.55, cadence:.8
  },
  nostalgic: {
    label:'Nostalgic', description:'Warm seventh chords, plagal motion, and bittersweet modal interchange.',
    dimensions:{brightness:55,tension:30,resolution:55,complexity:60,adventure:55,openness:70},
    degreeWeights:{1:1,2:.55,3:.85,4:1,5:.55,6:.95,7:.2},
    colors:{triad:.55,maj7:.95,min7:.85,add9:.65,maj9:.55,min9:.45,sus2:.45,sus4:.25,dominant7:.35,diminished:.18},
    borrowed:{iv:1,bVII:.7,bVI:.55,bII:.08,III:.4},
    transitions:rows({1:{3:1.2,6:1.35,4:1.25},2:{4:1.15,5:1.1},3:{6:1.3,4:1.2},4:{1:1.35,3:1.15,6:1.1},5:{1:1.15,6:1.15},6:{4:1.3,3:1.15,1:1.15},7:{1:1.1}}),
    voiceLeading:.85, cadence:.5
  },
  tense: {
    label:'Tense', description:'Dominant pull, diminished color, chromatic motion, and delayed resolution.',
    dimensions:{brightness:30,tension:95,resolution:20,complexity:70,adventure:80,openness:30},
    degreeWeights:{1:.65,2:.8,3:.6,4:.7,5:1,6:.6,7:1},
    colors:{triad:.35,maj7:.25,min7:.65,add9:.2,maj9:.15,min9:.35,sus2:.15,sus4:.55,dominant7:1,diminished:1},
    borrowed:{iv:.5,bVII:.55,bVI:.7,bII:1,III:.75},
    transitions:rows({1:{2:1.2,5:1.35,7:1.3},2:{5:1.5,7:1.2},3:{6:1.1,2:1.2},4:{5:1.4,2:1.1},5:{6:1.15,2:1.1,1:.85},6:{2:1.2,4:1.1},7:{1:1.1,5:1.2}}),
    voiceLeading:.6, cadence:.25
  }
}
