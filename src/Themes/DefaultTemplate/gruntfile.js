'use strict';
 
/**
 * Grunt Module
 */

var path = require('path');
module.exports = function(grunt) {
 

	/**
	 * Configuration
	 */

	grunt.initConfig({
		/**
		 * Get package meta data
		 */
		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Set project object
		 */
		project: {
		  //app: 'app',
		  //Assets: '<%= project.app %>/Assets',
		  Assets: 'Assets',
		  //src: '<%= project.Assets %>/src',
		  root: '/',
		  css: [
		    '<%= project.Assets %>/scss/main.scss'
		  ],
		  js: [
		    '<%= project.Assets %>/js/*.js'
		  ]
		},

		/**
		 * Project banner
		 */
		tag: {
		  banner: '/*!\n' +
		          ' * <%= pkg.name %>\n' +
		          ' * <%= pkg.title %>\n' +
		          ' * <%= pkg.url %>\n' +
		          ' * @author <%= pkg.author %>\n' +
		          ' * @version <%= pkg.version %>\n' +
		          //' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
		          ' */\n'
		},

		/**
		 * Sass
		 */
		sass: {
		  dev: {
		    options: {
		      style: 'expanded',
		      //banner: '<%= tag.banner %>',
		      compass: true
		    },
		    files: {
		      //'<%= project.Assets %>/css/main.css': 'Assets/scss/main.scss'	// 'destination': 'source'
		      '<%= project.Assets %>/css/main.css': '<%= project.Assets %>/scss/main.scss'	// 'destination': 'source'
		    }
		  },
		  dist: {
		    options: {
		      style: 'compressed',
		      compass: true
		    },
		    files: {
		      '<%= project.Assets %>/css/main.css': '<%= project.Assets %>/scss/main.scss %>'	// 'destination': 'source'
		    }
		  }
		},

		svgstore: {
			options: {
			  prefix : 'icon-', // This will prefix each ID
			  //cleanup: true,
			  cleanup: ['fill', 'style'],
			  svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
			    viewBox : '0 0 100 100',
			    xmlns: 'http://www.w3.org/2000/svg'
			  }
			},
			default: {
				files: {
				  // Target-specific file lists and/or options go here.
				  //'<%= project.Assets %>/img/svg-defs.svg' : ['<%= project.Assets %>/svg/*.svg']
				  'img/svg-defs.svg' : ['svg/*.svg']
				},
			}
		},

		svginjector: {
	        icons: {
	            options: {
	                container: 'SVGSprite'
	            },
	            files: {
	                'js/icons.js': 'img/svg-defs.svg'
	            }
	        }
	    },

		sprite:{
	      all: {
	        src: ['<%= project.Assets %>/sprites/*.png'],
	        dest: '<%= project.Assets %>/img/sprites.png',
	        //retinaSrcFilter: ['*@2x.png'],				//only if creating retina version for all images
	        //retinaDest: 'Assets/img/tripsprites@2x.png',
	        destCss: '<%= project.Assets %>/scss/_sprites.scss',
	        cssFormat: 'css',
	        // destCss: '<%= project.Assets %>/css/sprites.css',
	        cssSpritesheetName: 'sprites',
	        padding: 10
	      }
	    },

	    includereplace: {
		    /*dist: {
		      options: {
		        // Task-specific options go here.
		      	//prefix: '<!-- @@',
		      	//suffix: ' -->',
  				//includesDir: 'inc/'
  				cwd: '/'
		      },
		      // Files to perform replacements and includes with
		      src: '<%= project.root %>/inc/*.html',
		      // Destination directory to copy files to
		      dest: 'htmls/'
		    },*/
		    index: {
		    	src: [
		    		'inc/index.html'
		    	],
		    	dest: 'htmls/'
		    }
		  //   ,frontpage: {
				// options: {
				// 	// Task-specific options go here.
				// 	//prefix: '<!-- @@',
				// 	//suffix: ' -->',
				// 	//includesDir: 'inc/'
				// 	//cwd: '/'
				// },
		  //     	// Files to perform replacements and includes with
		  //     	src: [
		  //     		//'inc/frontpage.html','inc/frontpage-rtl.html','inc/interstitial.html','inc/interstitial-rtl.html','inc/direct-payment.html','inc/direct-payment-rtl.html'
		  //     		'inc/frontpage.html'
	   //    		],
		  //     // Destination directory to copy files to
		  //     dest: 'htmls/'
		  //   }
		},

		copy: {
			html: {
				files: [
					{
						expand: true,
						cwd: 'htmls/inc/',
						src: ['*.html'],
						dest: 'htmls/',
						filter: 'isFile'
					}
				]
			}
		},

		// htmlmin: {                                     // Task
		//     dist: {                                      // Target
		//       options: {                                 // Target options
		//         removeComments: true,
		//         collapseWhitespace: true
		//       },
		//       files: {                                   // Dictionary of files
		//         'htmls/min/index.html': 'htmls/index.html',     // 'destination': 'source'
		//         'htmls/min/frontpage.html': 'htmls/frontpage.html',     // 'destination': 'source'
		//         'htmls/min/frontpage-rtl.html': 'htmls/frontpage-rtl.html'     // 'destination': 'source'
	 //    	  }
	 //    	}
	 //    },

		/**
		 * Watch
		 */
		watch: {
		  sass: {
		    files: '<%= project.Assets %>/scss/{,*/}*.{scss,sass}',
		    tasks: ['sass:dev', 'svginjector:icons']
		  },
		  svgstore: {
		  	files: 'svg/*.svg',
		  	tasks: ['svgstore']
		  },
		  html: {
		    files: 'inc/{,*/}*.{htm,html}',
		    tasks: [
		    	'includereplace'
		    	,'copy:html'
		    	//,'htmlmin'
	    	]
		  }
		}

	});	//initConfig


	/**
	 * Default task
	 * Run `grunt` on the command line
	 */
	grunt.registerTask('default', [
	  'sass:dev',
	  'svgstore',
	  'svginjector:icons',
	  'watch'
	  ,'includereplace'
	  ,'copy'
	  //,'htmlmin'
	]);


	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-svgstore');
	grunt.loadNpmTasks('grunt-svginjector');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-spritesmith');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	//grunt.loadNpmTasks('grunt-contrib-uglify');

};