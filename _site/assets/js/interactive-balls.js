// Interactive draggable balls with graphene lattice animation
(function() {
  const numRows = 11;
  const numCols = 11;
  const numBalls = numRows * numCols;
  
  // Responsive ball size based on screen width
  function getBallSize() {
    const width = window.innerWidth;
    if (width <= 480) return 40; // Mobile phones
    if (width <= 768) return 50; // Tablets
    return 80; // Desktop
  }
  
  let ballSize = getBallSize(); // pixels
  const animationDuration = 40000; // 40 seconds in milliseconds
  
  // Generate hexagonal lattice positions programmatically
  function generateLatticePositions() {
    const positions = [];
    const startX = 5; // Starting x position (%)
    const startY = 5; // Starting y position (%)
    const spacingX = 9; // Horizontal spacing between balls (%)
    const spacingY = 9; // Vertical spacing between rows (%)
    const offsetX = 4.5; // Offset for alternating rows (half of spacingX)
    
    for (let row = 0; row < numRows; row++) {
      const isOffsetRow = row % 2 === 1; // Alternate rows are offset
      const y = startY + row * spacingY;
      
      for (let col = 0; col < numCols; col++) {
        const x = startX + col * spacingX + (isOffsetRow ? offsetX : 0);
        positions.push([x, y]);
      }
    }
    
    return positions;
  }
  
  const latticePositions = generateLatticePositions();
  
  let balls = [];
  let container = null;
  let draggedBall = null;
  let lastMouseX = null;
  let lastMouseY = null;
  let startTime = Date.now();
  
  // Save state to sessionStorage
  function saveState() {
    const state = {
      startTime: startTime,
      balls: balls.map(ball => ({
        currentX: ball.dataset.currentX,
        currentY: ball.dataset.currentY,
        velocityX: ball.dataset.velocityX,
        velocityY: ball.dataset.velocityY
      }))
    };
    sessionStorage.setItem('ballsState', JSON.stringify(state));
  }
  
  // Load state from sessionStorage
  function loadState() {
    const savedState = sessionStorage.getItem('ballsState');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
    return null;
  }
  
  // Clear state on explicit page reload (F5/Cmd+R)
  window.addEventListener('beforeunload', function(e) {
    // Only save state for navigation, not full reload
    if (e.currentTarget.performance && performance.navigation.type !== 1) {
      saveState();
    }
  });
  
  // Create container for balls
  function createContainer() {
    container = document.createElement('div');
    container.id = 'interactive-balls-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    `;
    document.body.insertBefore(container, document.body.firstChild);
    console.log('Interactive balls container created');
  }
  
  // Create individual ball
  function createBall(index) {
    const ball = document.createElement('div');
    ball.className = 'interactive-ball';
    ball.dataset.index = index;
    ball.style.cssText = `
      position: absolute;
      width: ${ballSize}px;
      height: ${ballSize}px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, 
        #ffffff 0%, 
        #e8ebf0 15%,
        #d8dde8 35%,
        #c8d0df 60%,
        #b8c3d4 80%,
        #a8b6c9 100%);
      box-shadow: 
        inset -10px -10px 20px rgba(0, 0, 0, 0.08),
        inset 8px 8px 15px rgba(255, 255, 255, 0.5),
        0 4px 12px rgba(0, 0, 0, 0.06),
        0 2px 4px rgba(0, 0, 0, 0.04);
      pointer-events: auto;
      cursor: grab;
      transition: none;
      transform-origin: center;
    `;
    
    const [x, y] = latticePositions[index];
    ball.dataset.latticeX = x;
    ball.dataset.latticeY = y;
    ball.dataset.isDragging = 'false';
    ball.dataset.velocityX = 0;
    ball.dataset.velocityY = 0;
    ball.dataset.currentX = x;
    ball.dataset.currentY = y;
    
    // Position ball (centered on coordinates)
    updateBallPosition(ball, x, y);
    
    // Add drag event listeners
    ball.addEventListener('mousedown', startDrag);
    ball.addEventListener('touchstart', startDrag, { passive: false });
    
    container.appendChild(ball);
    return ball;
  }
  
  // Update ball position (convert percentage to pixels, center the ball)
  function updateBallPosition(ball, xPercent, yPercent) {
    const x = (xPercent / 100) * window.innerWidth - ballSize / 2;
    const y = (yPercent / 100) * window.innerHeight - ballSize / 2;
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
  }
  
  // Get animation phase (0-1, where 0 = start/end of cycle)
  function getAnimationPhase() {
    const elapsed = Date.now() - startTime;
    return (elapsed % animationDuration) / animationDuration;
  }
  
  // Calculate position based on animation phase
  function getAnimatedPosition(ball) {
    if (ball.dataset.isDragging === 'true') {
      // Don't update position while dragging
      return [parseFloat(ball.dataset.currentX), parseFloat(ball.dataset.currentY)];
    }
    
    const phase = getAnimationPhase();
    const [targetX, targetY] = getPhasePosition(ball, phase);
    
    // Get velocity (from user interaction)
    let velocityX = parseFloat(ball.dataset.velocityX);
    let velocityY = parseFloat(ball.dataset.velocityY);
    
    // If there's any velocity at all, apply it
    if (Math.abs(velocityX) > 0.001 || Math.abs(velocityY) > 0.001) {
      // Get current position
      let currentX = parseFloat(ball.dataset.currentX);
      let currentY = parseFloat(ball.dataset.currentY);
      
      currentX += velocityX;
      currentY += velocityY;
      
      // Decay velocity very slowly
      velocityX *= 0.98; // Slower decay for longer momentum
      velocityY *= 0.98;
      
      ball.dataset.velocityX = velocityX;
      ball.dataset.velocityY = velocityY;
      ball.dataset.currentX = currentX;
      ball.dataset.currentY = currentY;
      
      return [currentX, currentY];
    }
    
    // Very low velocity - gradually return to animation path
    let currentX = parseFloat(ball.dataset.currentX);
    let currentY = parseFloat(ball.dataset.currentY);
    
    // Smoothly interpolate toward target (very slowly)
    currentX += (targetX - currentX) * 0.02;
    currentY += (targetY - currentY) * 0.02;
    
    ball.dataset.currentX = currentX;
    ball.dataset.currentY = currentY;
    ball.dataset.velocityX = 0;
    ball.dataset.velocityY = 0;
    
    return [currentX, currentY];
  }
  
  // Get position for specific animation phase
  function getPhasePosition(ball, phase) {
    const index = parseInt(ball.dataset.index);
    const latticeX = parseFloat(ball.dataset.latticeX);
    const latticeY = parseFloat(ball.dataset.latticeY);
    
    // Define keyframe positions (similar to CSS animation)
    const keyframes = [
      { time: 0, pos: [latticeX, latticeY] }, // Lattice formation
      { time: 0.2, pos: getVibrationPos(index, latticeX, latticeY) }, // Thermal vibration
      { time: 0.5, pos: getDispersionPos(index) }, // Random dispersion
      { time: 0.8, pos: getReformationPos(index, latticeX, latticeY) }, // Reformation
      { time: 1, pos: [latticeX, latticeY] } // Back to lattice
    ];
    
    // Find surrounding keyframes
    let k1 = keyframes[0], k2 = keyframes[1];
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (phase >= keyframes[i].time && phase <= keyframes[i + 1].time) {
        k1 = keyframes[i];
        k2 = keyframes[i + 1];
        break;
      }
    }
    
    // Interpolate between keyframes
    const segmentPhase = (phase - k1.time) / (k2.time - k1.time);
    const easedPhase = easeInOutCubic(segmentPhase);
    
    const x = k1.pos[0] + (k2.pos[0] - k1.pos[0]) * easedPhase;
    const y = k1.pos[1] + (k2.pos[1] - k1.pos[1]) * easedPhase;
    
    return [x, y];
  }
  
  // Easing function
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // Get vibration position (20% keyframe)
  function getVibrationPos(index, baseX, baseY) {
    const offsets = [
      [-1, 1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, -1], [1, 1], [-1, -1], [1, 1], [-1, -1], [1, 1]
    ];
    const offset = offsets[index % offsets.length];
    return [baseX + offset[0], baseY + offset[1]];
  }
  
  // Get dispersion position (50% keyframe) - random scattered
  function getDispersionPos(index) {
    // Use index as seed for consistent random positions
    const seed = index * 1234.5678;
    const pseudoRandom1 = (Math.sin(seed) * 10000) % 1;
    const pseudoRandom2 = (Math.cos(seed) * 10000) % 1;
    
    return [
      3 + Math.abs(pseudoRandom1) * 92,
      3 + Math.abs(pseudoRandom2) * 92
    ];
  }
  
  // Get reformation position (80% keyframe)
  function getReformationPos(index, baseX, baseY) {
    const offsets = [
      [1, -1], [1, 1], [-1, -1], [1, 1], [-1, -1], [1, 1], [-1, -1], [1, 1], [-1, -1], [1, 1], [-1, -1]
    ];
    const offset = offsets[index % offsets.length];
    return [baseX + offset[0], baseY + offset[1]];
  }
  
  // Drag handlers
  function startDrag(e) {
    e.preventDefault();
    draggedBall = this;
    draggedBall.dataset.isDragging = 'true';
    draggedBall.style.cursor = 'grabbing';
    draggedBall.style.transform = 'scale(1.2)';
    draggedBall.style.zIndex = '1000';
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    lastMouseX = clientX;
    lastMouseY = clientY;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDrag);
  }
  
  function drag(e) {
    if (!draggedBall) return;
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    if (lastMouseX !== null && lastMouseY !== null) {
      // Calculate mouse movement delta
      const deltaX = clientX - lastMouseX;
      const deltaY = clientY - lastMouseY;
      
      // Convert to percentage movement
      const deltaXPercent = (deltaX / window.innerWidth) * 100;
      const deltaYPercent = (deltaY / window.innerHeight) * 100;
      
      // Update ball position
      let currentX = parseFloat(draggedBall.dataset.currentX);
      let currentY = parseFloat(draggedBall.dataset.currentY);
      
      currentX += deltaXPercent;
      currentY += deltaYPercent;
      
      draggedBall.dataset.currentX = currentX;
      draggedBall.dataset.currentY = currentY;
      
      // Store velocity for momentum when released
      draggedBall.dataset.velocityX = deltaXPercent * 3.0; // Increased momentum significantly
      draggedBall.dataset.velocityY = deltaYPercent * 3.0;
      
      // Update visual position immediately
      updateBallPosition(draggedBall, currentX, currentY);
    }
    
    lastMouseX = clientX;
    lastMouseY = clientY;
  }
  
  function stopDrag() {
    if (draggedBall) {
      console.log('Released ball with velocity:', draggedBall.dataset.velocityX, draggedBall.dataset.velocityY);
      draggedBall.dataset.isDragging = 'false';
      draggedBall.style.cursor = 'grab';
      draggedBall.style.transform = 'scale(1)';
      draggedBall.style.zIndex = '';
      draggedBall = null;
    }
    
    lastMouseX = null;
    lastMouseY = null;
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', stopDrag);
  }
  
  // Animation loop
  function animate() {
    balls.forEach(ball => {
      const [x, y] = getAnimatedPosition(ball);
      if (ball.dataset.isDragging === 'false') {
        updateBallPosition(ball, x, y);
      }
    });
    
    requestAnimationFrame(animate);
  }
  
  // Handle window resize
  function handleResize() {
    ballSize = getBallSize(); // Update ball size on resize
    balls.forEach(ball => {
      ball.style.width = `${ballSize}px`;
      ball.style.height = `${ballSize}px`;
      const [x, y] = getAnimatedPosition(ball);
      updateBallPosition(ball, x, y);
    });
  }
  
  // Initialize
  function init() {
    console.log('Initializing interactive balls...');
    createContainer();
    
    // Try to restore previous state
    const savedState = loadState();
    if (savedState && savedState.startTime) {
      startTime = savedState.startTime;
      console.log('Restored animation start time from previous page');
    }
    
    for (let i = 0; i < numBalls; i++) {
      balls.push(createBall(i));
    }
    
    // Restore ball positions and velocities if available
    if (savedState && savedState.balls && savedState.balls.length === numBalls) {
      console.log('Restoring ball positions and velocities...');
      balls.forEach((ball, i) => {
        const ballState = savedState.balls[i];
        ball.dataset.currentX = ballState.currentX;
        ball.dataset.currentY = ballState.currentY;
        ball.dataset.velocityX = ballState.velocityX;
        ball.dataset.velocityY = ballState.velocityY;
        updateBallPosition(ball, parseFloat(ballState.currentX), parseFloat(ballState.currentY));
      });
    }
    
    console.log(`Created ${balls.length} balls`);
    console.log('Starting animation phase:', getAnimationPhase());
    
    window.addEventListener('resize', handleResize);
    
    // Save state periodically and on page navigation
    setInterval(saveState, 100); // Save every 100ms for smooth continuity
    window.addEventListener('pagehide', saveState);
    
    animate();
    
    // Debug: log first ball position every 2 seconds
    setInterval(() => {
      const phase = getAnimationPhase();
      const pos = getPhasePosition(balls[0], phase);
      console.log(`Phase: ${phase.toFixed(3)}, Ball 0 position:`, pos);
    }, 2000);
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
