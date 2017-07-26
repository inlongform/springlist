module.exports = function(grunt) {
    grunt.initConfig({

        //new
        nodemon: {
            dev: {
                script: 'server.js'
            }
        },
        sass: {
            dist: {
                files: {
                    'public/css/style.css': 'public/sass/style.scss'
                }
            }
        },
        jshint: {
            all: ['public/js/functions.js']
        },
        watch: {
            source: {
                files: ['public/sass/**/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true, // needed to run LiveReload
                }
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                compress: {
                    drop_console: true
                }
            },
            dist: {
                files: {
                    'public/js/app.min.js': ['public/js/functions.js', 'public//js/handlebars.runtime-v1.3.0.js', 'public/js/templates/templates.js']
                }
            }
        },
        cssmin: {
            add_banner: {
                options: {
                    banner: '/*! <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                },
                files: {
                    'public/css/app.min.css': ['public/css/style.css']
                }
            }
        },

        //new
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('min', ['sass', 'uglify', 'cssmin', 'jshint']);
    // grunt.registerTask('default', ['watch', 'sass']);
    grunt.registerTask('default', ['sass', 'concurrent']);
};