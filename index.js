const skills = document.querySelectorAll('.skills-list li');

skills.forEach(skill => {
  skill.addEventListener('mouseenter', () => {
    skill.style.transform = 'scale(1.1)';
    skill.style.transition = 'transform 0.3s';
  });

  skill.addEventListener('mouseleave', () => {
    skill.style.transform = 'scale(1)';
  });
});
